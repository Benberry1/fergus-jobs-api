INSERT INTO jobs (id, status, date_created, customer_id, notes) VALUES
(1, 'completed', '2022-06-14 23:59:21', 1, ARRAY ['Job complete 2nd June 22']),
(2, 'completed', '2022-06-24 23:59:21', 2, ARRAY ['Completed job 01/07/22']),
(3, 'invoicing', '2022-07-12 23:59:21', 3, ARRAY ['Called customer and set job for 20th July', 'Customer called and rescheduled to 1st August', 'Job completed 20th August']),
(4, 'active', '2022-07-19 23:59:21', 1, ARRAY ['Call customer to organise a time to meet and price', 'Job schedule for 1st September']),
(5, 'to price', '2022-08-20 23:59:21', 4, ARRAY ['Call customer to organise a time to meet and price']),
(6, 'scheduled', '2022-08-31 23:59:21', 2, ARRAY ['Customer called and organised time to price', 'Met with customer and priced job', 'Called customer and booked in for 20th September']);
