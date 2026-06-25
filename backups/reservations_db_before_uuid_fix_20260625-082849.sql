--
-- PostgreSQL database dump
--

\restrict k3pg36OUq8sqep1GUFvKhJLRztzEZYXTsosZUYfDIKBf5oNjHmkrGQum7pe9eML

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_reservations_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_reservations_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_reservations_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id integer NOT NULL,
    listing_id integer NOT NULL,
    guest_id integer NOT NULL,
    host_id integer NOT NULL,
    from_date date NOT NULL,
    to_date date NOT NULL,
    nights integer NOT NULL,
    price_per_night numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reservations_dates_check CHECK ((from_date < to_date)),
    CONSTRAINT reservations_nights_check CHECK ((nights > 0)),
    CONSTRAINT reservations_price_check CHECK ((price_per_night > (0)::numeric)),
    CONSTRAINT reservations_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'cancelled'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT reservations_total_check CHECK ((total > (0)::numeric))
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_id_seq OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;


--
-- Name: reservations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, listing_id, guest_id, host_id, from_date, to_date, nights, price_per_night, total, status, created_at, updated_at) FROM stdin;
1	181509	14	15	2026-07-23	2026-07-28	5	120.00	600.00	cancelled	2026-06-23 12:34:44.257891	2026-06-23 12:34:44.325957
2	181510	14	15	2026-08-12	2026-08-15	3	90.00	270.00	rejected	2026-06-23 12:34:44.339649	2026-06-23 12:34:44.348732
3	315940	16	17	2026-08-22	2026-08-26	4	75.00	300.00	confirmed	2026-06-23 12:35:19.229929	2026-06-23 12:35:19.241234
4	191159	18	77	2099-01-01	2099-01-04	3	25.50	76.50	pending	2026-06-23 23:11:59.87758	2026-06-23 23:11:59.87758
5	1191228	19	20	2099-02-01	2099-02-03	2	40.00	80.00	cancelled	2026-06-23 23:12:28.998693	2026-06-23 23:12:29.089202
\.


--
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_seq', 5, true);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: idx_reservations_guest_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_guest_id ON public.reservations USING btree (guest_id);


--
-- Name: idx_reservations_host_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_host_id ON public.reservations USING btree (host_id);


--
-- Name: idx_reservations_listing_active_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_listing_active_dates ON public.reservations USING btree (listing_id, from_date, to_date) WHERE ((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying])::text[]));


--
-- Name: reservations trg_reservations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_reservations_updated_at();


--
-- PostgreSQL database dump complete
--

\unrestrict k3pg36OUq8sqep1GUFvKhJLRztzEZYXTsosZUYfDIKBf5oNjHmkrGQum7pe9eML

