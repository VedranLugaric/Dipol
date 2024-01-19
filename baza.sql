--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-12-19 20:54:57

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
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- TOC entry 247 (class 1255 OID 42331)
-- Name: autor_promjena(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.autor_promjena() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    row_sudionik sudionik_sudjeluje_na%ROWTYPE;
BEGIN
	FOR row_sudionik IN (SELECT * FROM sudionik_sudjeluje_na) LOOP
		--promjeni autor
		UPDATE sudionik_sudjeluje_na
		SET autor = jeLiAutor(row_sudionik.id_sud, row_sudionik.id_konf)
		WHERE id_sud = row_sudionik.id_sud AND id_konf = row_sudionik.id_konf;

		--promjeni glasovao
		UPDATE sudionik_sudjeluje_na
		SET glasovao = autor
		WHERE id_sud = row_sudionik.id_sud AND id_konf = row_sudionik.id_konf AND glasovao = 0;

	END LOOP;

    RETURN NULL;
END;
$$;


ALTER FUNCTION public.autor_promjena() OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 38826)
-- Name: debug_jeliautor(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.debug_jeliautor(sudionik integer, konferencija integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result INT;
BEGIN
    SELECT COUNT(*)
    INTO result
    FROM sudionik_sudjeluje_na
    WHERE id_konf = konferencija AND id_sud = sudionik;

    RETURN result;
END;
$$;


ALTER FUNCTION public.debug_jeliautor(sudionik integer, konferencija integer) OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 40638)
-- Name: jeliautor(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.jeliautor(sudionik integer, konferencija integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
	result INTEGER;
BEGIN
    IF (
        (SELECT COUNT(*)
		FROM sudionik_sudjeluje_na
		LEFT JOIN rad_se_predstavlja_na ON rad_se_predstavlja_na.id_konf = sudionik_sudjeluje_na.id_konf
		LEFT JOIN rad ON rad.id_rad = rad_se_predstavlja_na.id_rad
		WHERE sudionik_sudjeluje_na.id_konf = konferencija AND sudionik_sudjeluje_na.id_sud = sudionik AND sudionik_sudjeluje_na.id_sud = rad.id_sud) != 0
    ) THEN
        result = 1;
    ELSE
        result = 0;
    END IF;
    RAISE NOTICE 'jeLiAutor(%,%): %', sudionik, konferencija, result;
	RETURN result;
END;
$$;


ALTER FUNCTION public.jeliautor(sudionik integer, konferencija integer) OWNER TO postgres;

--
-- TOC entry 246 (class 1255 OID 40897)
-- Name: update_autor_on_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_autor_on_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    row_sudionik sudionik_sudjeluje_na%ROWTYPE;
BEGIN
    -- Check if the triggering table is rad_se_predstavlja_na
    IF TG_TABLE_NAME = 'rad_se_predstavlja_na' THEN
        -- Iterate over the rows in sudionik_sudjeluje_na
        FOR row_sudionik IN (SELECT * FROM sudionik_sudjeluje_na) LOOP
            -- Call the jeLiAutor function and update autor in sudionik_sudjeluje_na
            UPDATE sudionik_sudjeluje_na
            SET autor = jeLiAutor(row_sudionik.id_sud, row_sudionik.id_konf)
            WHERE id_sud = row_sudionik.id_sud AND id_konf = row_sudionik.id_konf;
			
            -- Update glasovao only if it's currently zero
            UPDATE sudionik_sudjeluje_na
            SET glasovao = autor
            WHERE id_sud = row_sudionik.id_sud AND id_konf = row_sudionik.id_konf AND glasovao = 0;
			
        END LOOP;
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION public.update_autor_on_change() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 42998)
-- Name: konferencija; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.konferencija (
    id_konf integer NOT NULL,
    naziv character varying(100) NOT NULL,
    mjesto character varying(100) NOT NULL,
    vrijeme_poc timestamp with time zone NOT NULL,
    vrijeme_zav timestamp with time zone NOT NULL,
    video character varying(200) NOT NULL,
    opis character varying(1000) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.konferencija OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 42997)
-- Name: konferencija_id_konf_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.konferencija_id_konf_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.konferencija_id_konf_seq OWNER TO postgres;

--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 215
-- Name: konferencija_id_konf_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.konferencija_id_konf_seq OWNED BY public.konferencija.id_konf;


--
-- TOC entry 228 (class 1259 OID 43084)
-- Name: pokrovitelj; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pokrovitelj (
    id_pokrovitelj integer NOT NULL,
    ime character varying(100) NOT NULL
);


ALTER TABLE public.pokrovitelj OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 43083)
-- Name: pokrovitelj_id_pokrovitelj_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pokrovitelj_id_pokrovitelj_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pokrovitelj_id_pokrovitelj_seq OWNER TO postgres;

--
-- TOC entry 3432 (class 0 OID 0)
-- Dependencies: 227
-- Name: pokrovitelj_id_pokrovitelj_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pokrovitelj_id_pokrovitelj_seq OWNED BY public.pokrovitelj.id_pokrovitelj;


--
-- TOC entry 229 (class 1259 OID 43090)
-- Name: pokrovitelj_sponzorira; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pokrovitelj_sponzorira (
    id_pokrovitelj integer NOT NULL,
    id_konf integer NOT NULL
);


ALTER TABLE public.pokrovitelj_sponzorira OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 43034)
-- Name: posteri; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posteri (
    id_poster integer NOT NULL,
    poster character varying(200) NOT NULL
);


ALTER TABLE public.posteri OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 43033)
-- Name: posteri_id_poster_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posteri_id_poster_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posteri_id_poster_seq OWNER TO postgres;

--
-- TOC entry 3433 (class 0 OID 0)
-- Dependencies: 220
-- Name: posteri_id_poster_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posteri_id_poster_seq OWNED BY public.posteri.id_poster;


--
-- TOC entry 223 (class 1259 OID 43041)
-- Name: prezentacija; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prezentacija (
    prez character varying(200) NOT NULL,
    id_prez integer NOT NULL
);


ALTER TABLE public.prezentacija OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 43040)
-- Name: prezentacija_id_prez_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prezentacija_id_prez_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prezentacija_id_prez_seq OWNER TO postgres;

--
-- TOC entry 3434 (class 0 OID 0)
-- Dependencies: 222
-- Name: prezentacija_id_prez_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prezentacija_id_prez_seq OWNED BY public.prezentacija.id_prez;


--
-- TOC entry 225 (class 1259 OID 43048)
-- Name: rad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rad (
    naslov character varying(100) NOT NULL,
    id_rad integer NOT NULL,
    id_sud integer NOT NULL
);


ALTER TABLE public.rad OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 43047)
-- Name: rad_id_rad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rad_id_rad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rad_id_rad_seq OWNER TO postgres;

--
-- TOC entry 3435 (class 0 OID 0)
-- Dependencies: 224
-- Name: rad_id_rad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rad_id_rad_seq OWNED BY public.rad.id_rad;


--
-- TOC entry 226 (class 1259 OID 43059)
-- Name: rad_se_predstavlja_na; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rad_se_predstavlja_na (
    br_glasova integer DEFAULT 0 NOT NULL,
    id_poster integer NOT NULL,
    id_prez integer,
    id_rad integer NOT NULL,
    id_konf integer NOT NULL
);


ALTER TABLE public.rad_se_predstavlja_na OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 43104)
-- Name: reklama; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reklama (
    id_reklama integer NOT NULL,
    sadrzaj character varying(200) NOT NULL,
    id_pokrovitelj integer NOT NULL
);


ALTER TABLE public.reklama OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 43103)
-- Name: reklama_id_reklama_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reklama_id_reklama_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reklama_id_reklama_seq OWNER TO postgres;

--
-- TOC entry 3436 (class 0 OID 0)
-- Dependencies: 230
-- Name: reklama_id_reklama_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reklama_id_reklama_seq OWNED BY public.reklama.id_reklama;


--
-- TOC entry 218 (class 1259 OID 43008)
-- Name: sudionik; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sudionik (
    id_sud integer NOT NULL,
    prezime character varying(100) NOT NULL,
    ime character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    lozinka character varying(200) NOT NULL
);


ALTER TABLE public.sudionik OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 43007)
-- Name: sudionik_id_sud_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sudionik_id_sud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sudionik_id_sud_seq OWNER TO postgres;

--
-- TOC entry 3437 (class 0 OID 0)
-- Dependencies: 217
-- Name: sudionik_id_sud_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sudionik_id_sud_seq OWNED BY public.sudionik.id_sud;


--
-- TOC entry 232 (class 1259 OID 43115)
-- Name: sudionik_je_administrator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sudionik_je_administrator (
    id_konf integer NOT NULL,
    id_sud integer NOT NULL
);


ALTER TABLE public.sudionik_je_administrator OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 43018)
-- Name: sudionik_sudjeluje_na; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sudionik_sudjeluje_na (
    autor integer DEFAULT 0 NOT NULL,
    lozinka character varying(100) NOT NULL,
    glasovao integer DEFAULT 0 NOT NULL,
    id_konf integer NOT NULL,
    id_sud integer NOT NULL
);


ALTER TABLE public.sudionik_sudjeluje_na OWNER TO postgres;

--
-- TOC entry 3224 (class 2604 OID 43001)
-- Name: konferencija id_konf; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konferencija ALTER COLUMN id_konf SET DEFAULT nextval('public.konferencija_id_konf_seq'::regclass);


--
-- TOC entry 3233 (class 2604 OID 43087)
-- Name: pokrovitelj id_pokrovitelj; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pokrovitelj ALTER COLUMN id_pokrovitelj SET DEFAULT nextval('public.pokrovitelj_id_pokrovitelj_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 43037)
-- Name: posteri id_poster; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posteri ALTER COLUMN id_poster SET DEFAULT nextval('public.posteri_id_poster_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 43044)
-- Name: prezentacija id_prez; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prezentacija ALTER COLUMN id_prez SET DEFAULT nextval('public.prezentacija_id_prez_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 43051)
-- Name: rad id_rad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rad ALTER COLUMN id_rad SET DEFAULT nextval('public.rad_id_rad_seq'::regclass);


--
-- TOC entry 3234 (class 2604 OID 43107)
-- Name: reklama id_reklama; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reklama ALTER COLUMN id_reklama SET DEFAULT nextval('public.reklama_id_reklama_seq'::regclass);


--
-- TOC entry 3226 (class 2604 OID 43011)
-- Name: sudionik id_sud; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sudionik ALTER COLUMN id_sud SET DEFAULT nextval('public.sudionik_id_sud_seq'::regclass);


--
-- TOC entry 3408 (class 0 OID 42998)
-- Dependencies: 216
-- Data for Name: konferencija; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.konferencija (id_konf, naziv, mjesto, vrijeme_poc, vrijeme_zav, video, opis) FROM stdin;
\.


--
-- TOC entry 3420 (class 0 OID 43084)
-- Dependencies: 228
-- Data for Name: pokrovitelj; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pokrovitelj (id_pokrovitelj, ime) FROM stdin;
\.


--
-- TOC entry 3421 (class 0 OID 43090)
-- Dependencies: 229
-- Data for Name: pokrovitelj_sponzorira; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pokrovitelj_sponzorira (id_pokrovitelj, id_konf) FROM stdin;
\.


--
-- TOC entry 3413 (class 0 OID 43034)
-- Dependencies: 221
-- Data for Name: posteri; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posteri (id_poster, poster) FROM stdin;
\.


--
-- TOC entry 3415 (class 0 OID 43041)
-- Dependencies: 223
-- Data for Name: prezentacija; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prezentacija (prez, id_prez) FROM stdin;
\.


--
-- TOC entry 3417 (class 0 OID 43048)
-- Dependencies: 225
-- Data for Name: rad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rad (naslov, id_rad, id_sud) FROM stdin;
\.


--
-- TOC entry 3418 (class 0 OID 43059)
-- Dependencies: 226
-- Data for Name: rad_se_predstavlja_na; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rad_se_predstavlja_na (br_glasova, id_poster, id_prez, id_rad, id_konf) FROM stdin;
\.


--
-- TOC entry 3423 (class 0 OID 43104)
-- Dependencies: 231
-- Data for Name: reklama; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reklama (id_reklama, sadrzaj, id_pokrovitelj) FROM stdin;
\.


--
-- TOC entry 3410 (class 0 OID 43008)
-- Dependencies: 218
-- Data for Name: sudionik; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sudionik (id_sud, prezime, ime, email, lozinka) FROM stdin;
\.


--
-- TOC entry 3424 (class 0 OID 43115)
-- Dependencies: 232
-- Data for Name: sudionik_je_administrator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sudionik_je_administrator (id_konf, id_sud) FROM stdin;
\.


--
-- TOC entry 3411 (class 0 OID 43018)
-- Dependencies: 219
-- Data for Name: sudionik_sudjeluje_na; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sudionik_sudjeluje_na (autor, lozinka, glasovao, id_konf, id_sud) FROM stdin;
\.


--
-- TOC entry 3438 (class 0 OID 0)
-- Dependencies: 215
-- Name: konferencija_id_konf_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.konferencija_id_konf_seq', 1, false);


--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 227
-- Name: pokrovitelj_id_pokrovitelj_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pokrovitelj_id_pokrovitelj_seq', 1, false);


--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 220
-- Name: posteri_id_poster_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posteri_id_poster_seq', 1, false);


--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 222
-- Name: prezentacija_id_prez_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prezentacija_id_prez_seq', 1, false);


--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 224
-- Name: rad_id_rad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rad_id_rad_seq', 1, false);


--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 230
-- Name: reklama_id_reklama_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reklama_id_reklama_seq', 1, false);


--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 217
-- Name: sudionik_id_sud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sudionik_id_sud_seq', 1, false);


--
-- TOC entry 3236 (class 2606 OID 43006)
-- Name: konferencija konferencija_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konferencija
    ADD CONSTRAINT konferencija_pkey PRIMARY KEY (id_konf);


--
-- TOC entry 3248 (class 2606 OID 43089)
-- Name: pokrovitelj pokrovitelj_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pokrovitelj
    ADD CONSTRAINT pokrovitelj_pkey PRIMARY KEY (id_pokrovitelj);


--
-- TOC entry 3242 (class 2606 OID 43039)
-- Name: posteri posteri_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posteri
    ADD CONSTRAINT posteri_pkey PRIMARY KEY (id_poster);


--
-- TOC entry 3244 (class 2606 OID 43046)
-- Name: prezentacija prezentacija_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prezentacija
    ADD CONSTRAINT prezentacija_pkey PRIMARY KEY (id_prez);


--
-- TOC entry 3246 (class 2606 OID 43053)
-- Name: rad rad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rad
    ADD CONSTRAINT rad_pkey PRIMARY KEY (id_rad);


--
-- TOC entry 3250 (class 2606 OID 43109)
-- Name: reklama reklama_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reklama
    ADD CONSTRAINT reklama_pkey PRIMARY KEY (id_reklama);


--
-- TOC entry 3238 (class 2606 OID 43017)
-- Name: sudionik sudionik_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sudionik
    ADD CONSTRAINT sudionik_email_key UNIQUE (email);


--
-- TOC entry 3240 (class 2606 OID 43015)
-- Name: sudionik sudionik_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sudionik
    ADD CONSTRAINT sudionik_pkey PRIMARY KEY (id_sud);


--
-- TOC entry 3264 (class 2620 OID 43128)
-- Name: rad_se_predstavlja_na autor_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER autor_trigger AFTER INSERT OR DELETE OR UPDATE ON public.rad_se_predstavlja_na FOR EACH STATEMENT EXECUTE FUNCTION public.autor_promjena();


--
-- TOC entry 3263 (class 2620 OID 43129)
-- Name: sudionik_sudjeluje_na autor_trigger2; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER autor_trigger2 AFTER INSERT ON public.sudionik_sudjeluje_na FOR EACH STATEMENT EXECUTE FUNCTION public.autor_promjena();


--
-- TOC entry 3258 (class 2606 OID 43098)
-- Name: pokrovitelj_sponzorira pokrovitelj_sponzorira_id_konf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pokrovitelj_sponzorira
    ADD CONSTRAINT pokrovitelj_sponzorira_id_konf_fkey FOREIGN KEY (id_konf) REFERENCES public.konferencija(id_konf) ON DELETE CASCADE;


--
-- TOC entry 3259 (class 2606 OID 43093)
-- Name: pokrovitelj_sponzorira pokrovitelj_sponzorira_id_pokrovitelj_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pokrovitelj_sponzorira
    ADD CONSTRAINT pokrovitelj_sponzorira_id_pokrovitelj_fkey FOREIGN KEY (id_pokrovitelj) REFERENCES public.pokrovitelj(id_pokrovitelj) ON DELETE CASCADE;


--
-- TOC entry 3253 (class 2606 OID 43054)
-- Name: rad rad_id_sud_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rad
    ADD CONSTRAINT rad_id_sud_fkey FOREIGN KEY (id_sud) REFERENCES public.sudionik(id_sud) ON DELETE CASCADE;


--
-- TOC entry 3254 (class 2606 OID 43078)
-- Name: rad_se_predstavlja_na rad_se_predstavlja_na_id_konf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rad_se_predstavlja_na
    ADD CONSTRAINT rad_se_predstavlja_na_id_konf_fkey FOREIGN KEY (id_konf) REFERENCES public.konferencija(id_konf) ON DELETE CASCADE;


--
-- TOC entry 3255 (class 2606 OID 43063)
-- Name: rad_se_predstavlja_na rad_se_predstavlja_na_id_poster_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rad_se_predstavlja_na
    ADD CONSTRAINT rad_se_predstavlja_na_id_poster_fkey FOREIGN KEY (id_poster) REFERENCES public.posteri(id_poster) ON DELETE CASCADE;


--
-- TOC entry 3256 (class 2606 OID 43068)
-- Name: rad_se_predstavlja_na rad_se_predstavlja_na_id_prez_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rad_se_predstavlja_na
    ADD CONSTRAINT rad_se_predstavlja_na_id_prez_fkey FOREIGN KEY (id_prez) REFERENCES public.prezentacija(id_prez);


--
-- TOC entry 3257 (class 2606 OID 43073)
-- Name: rad_se_predstavlja_na rad_se_predstavlja_na_id_rad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rad_se_predstavlja_na
    ADD CONSTRAINT rad_se_predstavlja_na_id_rad_fkey FOREIGN KEY (id_rad) REFERENCES public.rad(id_rad) ON DELETE CASCADE;


--
-- TOC entry 3260 (class 2606 OID 43110)
-- Name: reklama reklama_id_pokrovitelj_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reklama
    ADD CONSTRAINT reklama_id_pokrovitelj_fkey FOREIGN KEY (id_pokrovitelj) REFERENCES public.pokrovitelj(id_pokrovitelj) ON DELETE CASCADE;


--
-- TOC entry 3261 (class 2606 OID 43118)
-- Name: sudionik_je_administrator sudionik_je_administrator_id_konf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sudionik_je_administrator
    ADD CONSTRAINT sudionik_je_administrator_id_konf_fkey FOREIGN KEY (id_konf) REFERENCES public.konferencija(id_konf) ON DELETE CASCADE;


--
-- TOC entry 3262 (class 2606 OID 43123)
-- Name: sudionik_je_administrator sudionik_je_administrator_id_sud_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sudionik_je_administrator
    ADD CONSTRAINT sudionik_je_administrator_id_sud_fkey FOREIGN KEY (id_sud) REFERENCES public.sudionik(id_sud) ON DELETE CASCADE;


--
-- TOC entry 3251 (class 2606 OID 43023)
-- Name: sudionik_sudjeluje_na sudionik_sudjeluje_na_id_konf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sudionik_sudjeluje_na
    ADD CONSTRAINT sudionik_sudjeluje_na_id_konf_fkey FOREIGN KEY (id_konf) REFERENCES public.konferencija(id_konf) ON DELETE CASCADE;


--
-- TOC entry 3252 (class 2606 OID 43028)
-- Name: sudionik_sudjeluje_na sudionik_sudjeluje_na_id_sud_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sudionik_sudjeluje_na
    ADD CONSTRAINT sudionik_sudjeluje_na_id_sud_fkey FOREIGN KEY (id_sud) REFERENCES public.sudionik(id_sud) ON DELETE CASCADE;


-- Completed on 2023-12-19 20:54:57

--
-- PostgreSQL database dump complete
--

