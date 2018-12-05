ALTER TABLE public.capabilities
	ADD COLUMN repetitive_loss BOOLEAN DEFAULT FALSE,
	ADD COLUMN origin_plan_name TEXT,
	ADD COLUMN origin_plan_year TEXT,
	ADD COLUMN funding_received NUMERIC,
	ADD COLUMN design_percent_complete INTEGER,
	ADD COLUMN scope_percent_complete INTEGER,
	ADD COLUMN status_proposed BOOLEAN DEFAULT FALSE,
	ADD COLUMN start_date TIMESTAMP WITH TIME ZONE,
	ADD COLUMN completed_date TIMESTAMP WITH TIME ZONE,
	ADD COLUMN justification TEXT;