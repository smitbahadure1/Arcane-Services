-- Update service images with proper photos

-- Kitchen Sink Installation - actual kitchen sink photo
UPDATE services 
SET image_url = 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE title = 'Kitchen Sink Installation';

-- Emergency Plumbing Repair - actual plumbing tools and repair photo
UPDATE services 
SET image_url = 'https://images.pexels.com/photos/162539/architecture-building-construction-work-162539.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE title = 'Emergency Plumbing Repair';

-- AC Installation & Repair - actual AC unit installation photo
UPDATE services 
SET image_url = 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE title = 'AC Installation & Repair';
