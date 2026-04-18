-- Add ingredients for all recipes
-- This migration adds sample ingredients to make the shopping list functional

-- Recipe: Havermout met banaan en honing
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Havermout', 60, 'g', 'granen', true FROM recipes WHERE name = 'Havermout met banaan en honing';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Melk', 200, 'ml', 'zuivel', true FROM recipes WHERE name = 'Havermout met banaan en honing';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Banaan', 1, 'stuks', 'fruit', true FROM recipes WHERE name = 'Havermout met banaan en honing';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Honing', 1, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Havermout met banaan en honing';

-- Recipe: Yoghurt bowl met muesli
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Yoghurt', 200, 'g', 'zuivel', true FROM recipes WHERE name = 'Yoghurt bowl met muesli';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Muesli', 50, 'g', 'granen', true FROM recipes WHERE name = 'Yoghurt bowl met muesli';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Banaan', 0.5, 'stuks', 'fruit', true FROM recipes WHERE name = 'Yoghurt bowl met muesli';

-- Recipe: Geroosterde boterham met ei
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Brood', 2, 'sneetjes', 'granen', true FROM recipes WHERE name = 'Geroosterde boterham met ei';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Eieren', 2, 'stuks', 'overig', true FROM recipes WHERE name = 'Geroosterde boterham met ei';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Boter', 10, 'g', 'zuivel', false FROM recipes WHERE name = 'Geroosterde boterham met ei';

-- Recipe: Overnight oats
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Havermout', 60, 'g', 'granen', true FROM recipes WHERE name = 'Overnight oats';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Melk', 200, 'ml', 'zuivel', true FROM recipes WHERE name = 'Overnight oats';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Chiazaad', 1, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Overnight oats';

-- Recipe: Pannenkoeken
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Bloem', 200, 'g', 'granen', true FROM recipes WHERE name = 'Pannenkoeken';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Melk', 300, 'ml', 'zuivel', true FROM recipes WHERE name = 'Pannenkoeken';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Eieren', 2, 'stuks', 'overig', true FROM recipes WHERE name = 'Pannenkoeken';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Stroop', 4, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Pannenkoeken';

-- Recipe: Mediterrane quinoa bowl
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Quinoa', 150, 'g', 'granen', true FROM recipes WHERE name = 'Mediterrane quinoa bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Komkommer', 1, 'stuks', 'groente', true FROM recipes WHERE name = 'Mediterrane quinoa bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Tomaat', 2, 'stuks', 'groente', true FROM recipes WHERE name = 'Mediterrane quinoa bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Feta', 100, 'g', 'zuivel', true FROM recipes WHERE name = 'Mediterrane quinoa bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Olijven', 50, 'g', 'overig', false FROM recipes WHERE name = 'Mediterrane quinoa bowl';

-- Recipe: Thaise noedelsoep
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Rijstnoedels', 200, 'g', 'granen', true FROM recipes WHERE name = 'Thaise noedelsoep';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Kokosmelk', 400, 'ml', 'overig', true FROM recipes WHERE name = 'Thaise noedelsoep';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Paksoi', 1, 'stuks', 'groente', true FROM recipes WHERE name = 'Thaise noedelsoep';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Currypasta', 2, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Thaise noedelsoep';

-- Recipe: Gegrilde groente wrap
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Wrap', 1, 'stuks', 'granen', true FROM recipes WHERE name = 'Gegrilde groente wrap';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Paprika', 1, 'stuks', 'groente', true FROM recipes WHERE name = 'Gegrilde groente wrap';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Courgette', 1, 'stuks', 'groente', true FROM recipes WHERE name = 'Gegrilde groente wrap';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Hummus', 3, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Gegrilde groente wrap';

-- Recipe: Zalm poke bowl
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Sushirijst', 200, 'g', 'granen', true FROM recipes WHERE name = 'Zalm poke bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Zalm', 150, 'g', 'vis', true FROM recipes WHERE name = 'Zalm poke bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Avocado', 1, 'stuks', 'fruit', true FROM recipes WHERE name = 'Zalm poke bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Sojasaus', 2, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Zalm poke bowl';

-- Recipe: Italiaanse panini
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Ciabatta', 1, 'stuks', 'granen', true FROM recipes WHERE name = 'Italiaanse panini';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Mozzarella', 100, 'g', 'zuivel', true FROM recipes WHERE name = 'Italiaanse panini';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Tomaat', 1, 'stuks', 'groente', true FROM recipes WHERE name = 'Italiaanse panini';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Pesto', 2, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Italiaanse panini';

-- Recipe: Gegrilde kip met zoete aardappel
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Kipfilet', 400, 'g', 'vlees', true FROM recipes WHERE name = 'Gegrilde kip met zoete aardappel';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Zoete aardappel', 600, 'g', 'groente', true FROM recipes WHERE name = 'Gegrilde kip met zoete aardappel';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Paprikapoeder', 1, 'theelepels', 'overig', false FROM recipes WHERE name = 'Gegrilde kip met zoete aardappel';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Olijfolie', 2, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Gegrilde kip met zoete aardappel';

-- Recipe: Noorse zalm met dille saus
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Zalmfilet', 400, 'g', 'vis', true FROM recipes WHERE name = 'Noorse zalm met dille saus';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Room', 200, 'ml', 'zuivel', true FROM recipes WHERE name = 'Noorse zalm met dille saus';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Dille', 1, 'stuks', 'groente', false FROM recipes WHERE name = 'Noorse zalm met dille saus';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Citroen', 0.5, 'stuks', 'fruit', false FROM recipes WHERE name = 'Noorse zalm met dille saus';

-- Recipe: Vegetarische linzen curry
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Linzen', 250, 'g', 'groente', true FROM recipes WHERE name = 'Vegetarische linzen curry';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Kokosmelk', 400, 'ml', 'overig', true FROM recipes WHERE name = 'Vegetarische linzen curry';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Spinazie', 200, 'g', 'groente', true FROM recipes WHERE name = 'Vegetarische linzen curry';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Currypasta', 2, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Vegetarische linzen curry';

-- Recipe: Griekse kofte met tzatziki
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Rundergehakt', 400, 'g', 'vlees', true FROM recipes WHERE name = 'Griekse kofte met tzatziki';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Yoghurt', 200, 'g', 'zuivel', true FROM recipes WHERE name = 'Griekse kofte met tzatziki';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Komkommer', 0.5, 'stuks', 'groente', true FROM recipes WHERE name = 'Griekse kofte met tzatziki';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Pitabroodje', 4, 'stuks', 'granen', false FROM recipes WHERE name = 'Griekse kofte met tzatziki';

-- Recipe: Aziatische noedels met garnalen
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Noedels', 300, 'g', 'granen', true FROM recipes WHERE name = 'Aziatische noedels met garnalen';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Garnalen', 300, 'g', 'vis', true FROM recipes WHERE name = 'Aziatische noedels met garnalen';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Paksoi', 1, 'stuks', 'groente', true FROM recipes WHERE name = 'Aziatische noedels met garnalen';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT id, 'Sojasaus', 3, 'eetlepels', 'overig', false FROM recipes WHERE name = 'Aziatische noedels met garnalen';
