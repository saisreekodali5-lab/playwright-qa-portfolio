import { test, expect, type APIRequestContext } from '@playwright/test';

// Public admin credentials published in the Restful Booker documentation.
const ADMIN = { username: 'admin', password: 'password123' };

const newBooking = {
  firstname: 'Sai',
  lastname: 'Tester',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/auth', { data: ADMIN });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.token).toBeTruthy();
  return body.token;
}

test.describe('Booking API', () => {
  test('health check responds', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('auth fails with wrong credentials', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    const body = await res.json();
    expect(body.reason).toBe('Bad credentials');
  });

  test('full booking lifecycle: create, read, update, delete', async ({ request }) => {
    // Create
    const created = await request.post('/booking', { data: newBooking });
    expect(created.status()).toBe(200);
    const { bookingid, booking } = await created.json();
    expect(bookingid).toEqual(expect.any(Number));
    expect(booking).toMatchObject(newBooking);

    // Read
    const fetched = await request.get(`/booking/${bookingid}`);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toMatchObject(newBooking);

    // Update (requires auth token)
    const token = await getToken(request);
    const updatedData = { ...newBooking, totalprice: 200, additionalneeds: 'Late checkout' };
    const updated = await request.put(`/booking/${bookingid}`, {
      data: updatedData,
      headers: { Cookie: `token=${token}` },
    });
    expect(updated.status()).toBe(200);
    expect(await updated.json()).toMatchObject({ totalprice: 200, additionalneeds: 'Late checkout' });

    // Delete
    const deleted = await request.delete(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleted.status()).toBe(201);

    // Verify it is gone
    const afterDelete = await request.get(`/booking/${bookingid}`);
    expect(afterDelete.status()).toBe(404);
  });

  test('update without a token is rejected', async ({ request }) => {
    const created = await request.post('/booking', { data: newBooking });
    const { bookingid } = await created.json();

    const res = await request.put(`/booking/${bookingid}`, { data: { ...newBooking, totalprice: 1 } });
    expect(res.status()).toBe(403);
  });

  test('bookings can be filtered by guest name', async ({ request }) => {
    const created = await request.post('/booking', { data: newBooking });
    const { bookingid } = await created.json();

    const res = await request.get('/booking', {
      params: { firstname: newBooking.firstname, lastname: newBooking.lastname },
    });
    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(bookingid);
  });
});
