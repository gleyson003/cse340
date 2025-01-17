select 
	inv_make as Make, 
	inv_model as Model, 
	inv_color as color, 
	inv_year as year,
	inv_miles as miles,
	inv_price as price	
from inventory
where inv_make = 'Ford'
	and inv_model ilike '%victoria%'

INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

UPDATE account
set account_type = 'Admin'
where account_firstname = 'Tony'

DELETE FROM account
where account_firstname = 'Tony'

UPDATE inventory
set inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
where inv_make = 'GM'

select inv_make, inv_model, classification_name 
from inventory
	inner join classification on classification.classification_id = inventory.classification_id
where classification_name = 'Sport'

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_image, '/images/', '/images/vehicles/')




