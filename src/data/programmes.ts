import { LocaleType, ProgrammeType } from '../interfaces';

export const programmes: ProgrammeType[] = [
  {
    name: {
      nb: 'Bygg- og anleggsteknikk',
      nn: 'Bygg- og anleggsteknikk',
      en: 'Bygg- og anleggsteknikk',
    },
    url: {
      nb: 'bygg-og-anleggsteknikk',
      nn: 'bygg-og-anleggsteknikk',
      en: 'bygg-og-anleggsteknikk',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogram med programfagene Praktisk yrkesutøvelse og Arbeidsmiljø og dokumentasjon i Bygg- og anleggsteknikk.',
        nn:
          'Utdanningsprogram med programfaga Praktisk yrkesutøving og Arbeidsmiljø og dokumentasjon i Bygg- og anleggsteknikk.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/4WzuGfBZ.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:0d67724e-d9fa-4365-9839-4cc91c012855',
              },
              {
                id: 'urn:subject:1:9b7e7534-c072-4412-b8ef-df076308cad0',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:e1272473-7361-4129-8bfd-a0d6ebc8cf98',
              },
              {
                id: 'urn:subject:1:10f1822a-86ab-4a35-a9bf-477f98775617',
              },
              {
                id: 'urn:subject:1:48d5ff11-d459-4327-bbe5-8dd313e9dcbf',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },

        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Elektro og datateknologi',
      nn: 'Elektro og datateknologi',
      en: 'Elektro og datateknologi',
    },
    url: {
      nb: 'elektro-og-datateknologi',
      nn: 'elektro-og-datateknologi',
      en: 'elektro-og-datateknologi',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av programfagene elektroniske kretser og nettverk og energi og styresystemer i tillegg til yrkesfaglig fordypning.',
        nn:
          'Utdanningsprogrammet består av programfaga elektroniske kretser og nettverk og energi og styresystemer i tillegg til yrkesfagleg fordjuping.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/8vHJcYft.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:d92be649-8bda-4514-b04d-2d3c5251aa79',
              },
              {
                id: 'urn:subject:1:8c5a9fdd-4fa4-456b-9afe-34e7e776b4e7',
              },
              {
                id: 'urn:subject:1:57d2a2c6-b75a-4264-9f56-a692ef56e06c',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:4c20c255-cf86-44b7-b628-950a4911c686',
              },
              {
                id: 'urn:subject:1:ffb5b58f-c993-4cba-99f5-40844b51e588',
              },
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:7a0cbbc6-f213-4545-a6e3-44d3043ddaae',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Frisør, blomster, interiør og eksponeringsdesign',
      nn: 'Frisør, blomar, interiør og eksponeringsdesign',
      en: 'Frisør, blomster, interiør og eksponeringsdesign',
    },
    url: {
      nb: 'frisor-blomster-interior-og-eksponeringsdesign',
      nn: 'frisor-blomster-interior-og-eksponeringsdesign',
      en: 'frisor-blomster-interior-og-eksponeringsdesign',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av programfagene produktutvikling og produksjon og kommunikasjon, kunde og arbeidsliv i tillegg til yrkesfaglig fordypning.',
        nn:
          'Utdanningsprogrammet består av programfaga produktutvikling og produksjon og kommunikasjon, kunde og arbeidsliv i tillegg til yrkesfagleg fordjuping.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/co1nyxz1.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:31f764fe-d885-4fc6-93f5-53e1d50670fa',
              },
              {
                id: 'urn:subject:52b154e8-eb71-49cb-b046-c41303eb9b99',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:6c28a8a2-2291-49d6-aeb9-48315063ab4c',
              },
              {
                id: 'urn:subject:1:9031c947-8761-4db7-ab02-33dc3a8ba2e2',
              },
              {
                id: 'urn:subject:1:b4f8369c-139e-4a3f-8c79-f1341be06501',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Håndverk, design og produktutvikling',
      nn: 'Handverk, design og produktutvikling',
      en: 'Håndverk, design og produktutvikling',
    },
    url: {
      nb: 'handverk-design-og-produktutvikling',
      nn: 'handverk-design-og-produktutvikling',
      en: 'handverk-design-og-produktutvikling',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av programfagene produktutvikling og skapende prosesser og materialer og teknikker i tillegg til yrkesfaglig fordypning.',
        nn:
          'Utdanningsprogrammet består av programfaga produktutvikling og skapende prosesser og materialer og teknikker i tillegg til yrkesfagleg fordjuping.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/omQ1nTbk.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:6055d62b-8373-47d3-8b56-e3d4c5560ff5',
              },
              {
                id: 'urn:subject:2fc808ef-7cd4-4982-a429-fa0939e784aa',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:e4f1bd93-e941-4f7e-a150-1dd99a9ac419',
              },
              {
                id: 'urn:subject:1:43fcb3a9-0144-4b7b-bba9-40e447f17303',
              },
              {
                id: 'urn:subject:1:919bde2e-9525-4eb1-88f4-3f730f793cf9',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Helse- og oppvekstfag',
      nn: 'Helse- og oppvekstfag',
      en: 'Helse- og oppvekstfag',
    },
    url: {
      nb: 'helse-og-oppvekstfag',
      nn: 'helse-og-oppvekstfag',
      en: 'helse-og-oppvekstfag',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogram med programfagene helsefremmende arbeid, kommunikasjon og samhandling og yrkesliv i helse- og oppvekstfag og yrkesfaglig fordypning.',
        nn:
          'Utdanningsprogram med programfaga helsefremmende arbeid, kommunikasjon og samhandling og yrkesliv i helse- og oppvekstfag og yrkesfagleg fordjuping.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/QhG3IA4s.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:2cbe8089-7d7b-407f-8f04-fbfdc116abc1',
              },
              {
                id: 'urn:subject:1:777ae87e-ca79-4866-920a-115cfeb7bbe1',
              },
              {
                id: 'urn:subject:1:113986bb-9b00-42dc-b1ff-0b9a352369f4',
              },
              {
                id: 'urn:subject:1:ab5e9191-407a-492e-a2b9-5071275a37a7',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:daa130e2-5035-4803-b3c0-6158f455a982',
              },
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:aeaf8fcc-9ad2-4f23-a2cf-d764194f5380',
              },
              {
                id: 'urn:subject:1:2205eb3b-73d5-4d01-a69b-83d1b842636b',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        categories: [
          {
            name: {
              nb: 'Helsearbeiderfag',
              nn: 'Helsearbeidarfag',
              en: 'Helsearbeiderfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:1b7155ae-9670-4972-b438-fd1375875ac1',
              },
              {
                id: 'urn:subject:1:18fa6a42-a5d2-44d9-bf47-e772a83d82f4',
              },
              {
                id: 'urn:subject:1:f644f829-4e7a-4e74-a63a-342ef786f68a',
              },
              {
                id: 'urn:subject:1:9c50184f-6e9c-4229-a328-c7490b6dad37',
              },
            ],
          },
          {
            name: {
              nb: 'Barne- og ungdomsarbeiderfag',
              nn: 'Barne- og ungdomsarbeidarfag',
              en: 'Barne- og ungdomsarbeiderfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:03e810db-3560-47b5-a5f6-e7afe1d0a2d6',
              },
              {
                id: 'urn:subject:1:793027a5-0b4c-42c1-a2aa-840aaf9f8083',
              },
              {
                id: 'urn:subject:1:56ea35da-73d9-431f-a451-19f24f564f59',
              },
              {
                id: 'urn:subject:1:87aecb77-cd9d-4679-8c6f-043e9f8046f9',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Idrettsfag',
      nn: 'Idrettsfag',
      en: 'Idrettsfag',
    },
    url: {
      nb: 'idrettsfag',
      nn: 'idrettsfag',
      en: 'idrettsfag',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av programfagene aktivitetslære, treningslære, idrett og samfunn og treningsledelse. Du oppnår studiekompetanse.',
        nn:
          'Utdanningsprogrammet består av programfaga aktivitetslære, treningslære, idrett og samfunn og treningsledelse. Du oppnår studiekompetanse.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/tEoZoZj2.jpg' },
    grades: [
      {
        name: 'Vg1',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:4ad7fe49-b14a-4caf-8e19-ad402d1e2ce6',
              },
              {
                id: 'urn:subject:1:f18b0daa-6507-4025-8998-b8a11c8ccc70',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:605d33e0-1695-4540-9255-fc5e612e996f',
              },
              {
                id: 'urn:subject:1:a3c1b65a-c41f-4879-b650-32a13fe1801b',
              },
              {
                id: 'urn:subject:1:8bfd0a97-d456-448d-8b5f-3bc49e445b37',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:a5d7da3a-8a19-4a83-9b3f-3c855621df70',
              },
              {
                id: 'urn:subject:1:f7c5f36a-198d-4c38-a330-2957cf1a8325',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:50dfc86d-6566-4a45-a531-d32b82e8bfa1',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:d4511941-a1fc-4336-bc80-0a05c534a182',
              },
              {
                id: 'urn:subject:1:ff69c291-6374-4766-80c2-47d5840d8bbf',
              },
              {
                id: 'urn:subject:1:a45bba8f-61b7-4dc5-8609-126c4d9c7652',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg3',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:30bcefff-7577-4e0b-afc6-b07f437ea354',
              },
              {
                id: 'urn:subject:cc109c51-a083-413b-b497-7f80a0569a92',
              },
              {
                id: 'urn:subject:ea2822da-52f0-4517-bf01-c63f8e96f446',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:c499dbee-cfdd-4b76-8836-ae685db03baa',
              },
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:da2379d0-3c91-4e4d-94d7-fc42f69593d2',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:ea9e2be1-461d-4929-9dae-590e8cb9657f',
              },
              {
                id: 'urn:subject:f2ef1c73-d706-44e9-b1bd-7923842d6b4e',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:576cc40f-cc74-4418-9721-9b15ffd29cff',
              },
              {
                id: 'urn:subject:6e2e2319-cb8a-4dd2-b382-e30f001633bb',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Informasjonsteknologi og medieproduksjon',
      nn: 'Informasjonsteknologi og medieproduksjon',
      en: 'Informasjonsteknologi og medieproduksjon',
    },
    url: {
      nb: 'informasjonsteknologi-og-medieproduksjon',
      nn: 'informasjonsteknologi-og-medieproduksjon',
      en: 'informasjonsteknologi-og-medieproduksjon',
    },
    meta: {
      description: {
        nb:
          'IT og media er fagområder i utvikling og med økende overlapping. Her finner du fagstoff, oppgaver og læringsressurser til utdanningsprogrammet IM Vg1.',
        nn:
          'IT og media er fagområde i utvikling og med aukande overlapping. Her finn du fagstoff, oppgåver og læringsressursar til utdanningsprogrammet IM Vg1.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/1nOY6rEf.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:1352b19e-e706-4480-a728-c6b0a57ba8ae',
              },
              {
                id: 'urn:subject:1:763fc674-6cef-46ac-8ffe-ea6d76d56dbd',
              },
              {
                id: 'urn:subject:1:81b3892a-78e7-4e43-bc31-fd5f8a5090e7',
              },
              {
                id: 'urn:subject:1:c0cd454f-c937-4fcb-ae2d-feaa8c0eeae9',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:dbd108ac-73b3-4efc-92d5-1bbbed22abaf',
              },
              {
                id: 'urn:subject:1:6012d8a9-994a-4b21-b4a1-8c54443fc0d1',
              },
              {
                id: 'urn:subject:1:330336a5-9e92-405b-bb5c-b0e8bdc8ba98',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        categories: [
          {
            name: {
              en: 'Informasjonsteknologi',
              nb: 'Informasjonsteknologi',
              nn: 'Informasjonsteknologi',
            },
            subjects: [
              {
                id: 'urn:subject:f41eadfa-0749-4ab4-bc17-a500adad38b8',
              },
              {
                id: 'urn:subject:26f1cd12-4242-486d-be22-75c3750a52a2',
              },
              {
                id: 'urn:subject:5e53694a-c8eb-4871-8558-71523941c28e',
              },
            ],
          },
          {
            name: {
              en: 'Medieproduksjon',
              nb: 'Medieproduksjon',
              nn: 'Medieproduksjon',
            },
            subjects: [
              {
                id: 'urn:subject:a6b56b7e-2149-4216-92b6-3095feb870f3',
              },
              {
                id: 'urn:subject:a453ed64-da44-4d85-93a1-2962e597ff6a',
              },
              {
                id: 'urn:subject:8ede7bb4-be9e-4039-911c-e2d14f7c033d',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Kunst, design og arkitektur',
      nn: 'Kunst, design og arkitektur',
      en: 'Kunst, design og arkitektur',
    },
    url: {
      nb: 'kunst-design-og-arkitektur',
      nn: 'kunst-design-og-arkitektur',
      en: 'kunst-design-og-arkitektur',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av programfagene design og arkitektur og kunst og visuelle hjelpemidler. Du oppnår studiekompetanse.',
        nn:
          'Utdanningsprogrammet består av programfagene design og arkitektur og kunst og visuelle hjelpemidler. Du oppnår studiekompetanse.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/q13BFrCg.jpg' },
    grades: [
      {
        name: 'Vg1',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:4ad7fe49-b14a-4caf-8e19-ad402d1e2ce6',
              },
              {
                id: 'urn:subject:1:f18b0daa-6507-4025-8998-b8a11c8ccc70',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:605d33e0-1695-4540-9255-fc5e612e996f',
              },
              {
                id: 'urn:subject:1:a3c1b65a-c41f-4879-b650-32a13fe1801b',
              },
              {
                id: 'urn:subject:1:8bfd0a97-d456-448d-8b5f-3bc49e445b37',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:a5d7da3a-8a19-4a83-9b3f-3c855621df70',
              },
              {
                id: 'urn:subject:1:f7c5f36a-198d-4c38-a330-2957cf1a8325',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:50dfc86d-6566-4a45-a531-d32b82e8bfa1',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:d4511941-a1fc-4336-bc80-0a05c534a182',
              },
              {
                id: 'urn:subject:1:ff69c291-6374-4766-80c2-47d5840d8bbf',
              },
              {
                id: 'urn:subject:1:a45bba8f-61b7-4dc5-8609-126c4d9c7652',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg3',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:187c1484-84a5-474d-bf63-0c7915809a7d',
              },
              {
                id: 'urn:subject:30bcefff-7577-4e0b-afc6-b07f437ea354',
              },
              {
                id: 'urn:subject:cc109c51-a083-413b-b497-7f80a0569a92',
              },
              {
                id: 'urn:subject:ea2822da-52f0-4517-bf01-c63f8e96f446',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:da2379d0-3c91-4e4d-94d7-fc42f69593d2',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:ea9e2be1-461d-4929-9dae-590e8cb9657f',
              },
              {
                id: 'urn:subject:f2ef1c73-d706-44e9-b1bd-7923842d6b4e',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:187c1484-84a5-474d-bf63-0c7915809a7d',
              },
              {
                id: 'urn:subject:1:576cc40f-cc74-4418-9721-9b15ffd29cff',
              },

              {
                id: 'urn:subject:6e2e2319-cb8a-4dd2-b382-e30f001633bb',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Medier og kommunikasjon',
      nn: 'Medium og kommunikasjon',
      en: 'Medier og kommunikasjon',
    },
    url: {
      nb: 'medier-og-kommunikasjon',
      nn: 'medier-og-kommunikasjon',
      en: 'medier-og-kommunikasjon',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av programfagene mediesamfunnet og medieuttrykk. Du oppnår studiekompetanse.',
        nn:
          'Utdanningsprogrammet består av programfaga mediesamfunnet og medieuttrykk. Du oppnår studiekompetanse.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/mtbzOofz.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:e7b9fcee-cb8b-4e0e-a16d-d7dddbe0b643',
              },
              {
                id: 'urn:subject:1:090997c4-78d3-4a79-93ad-178d465cdba3',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:4ad7fe49-b14a-4caf-8e19-ad402d1e2ce6',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:f18b0daa-6507-4025-8998-b8a11c8ccc70',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:605d33e0-1695-4540-9255-fc5e612e996f',
              },
              {
                id: 'urn:subject:1:a3c1b65a-c41f-4879-b650-32a13fe1801b',
              },
              {
                id: 'urn:subject:1:8bfd0a97-d456-448d-8b5f-3bc49e445b37',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:a5d7da3a-8a19-4a83-9b3f-3c855621df70',
              },
              {
                id: 'urn:subject:1:f7c5f36a-198d-4c38-a330-2957cf1a8325',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:00a0141d-2307-4a5a-a154-0c821449f6d2',
              },
              {
                id: 'urn:subject:1:ca0f428c-d59a-4836-83be-83cbc3191a23',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:50dfc86d-6566-4a45-a531-d32b82e8bfa1',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:d4511941-a1fc-4336-bc80-0a05c534a182',
              },
              {
                id: 'urn:subject:1:ff69c291-6374-4766-80c2-47d5840d8bbf',
              },
              {
                id: 'urn:subject:1:a45bba8f-61b7-4dc5-8609-126c4d9c7652',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:47678c7b-bc09-4fc8-b2d9-a2e3d709e105',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg3',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:7588cdad-751d-46a8-8546-caa28075a167',
              },
              {
                id: 'urn:subject:1:20bc82bc-62e3-4276-8629-84a65b8a6ad2',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:187c1484-84a5-474d-bf63-0c7915809a7d',
              },
              {
                id: 'urn:subject:30bcefff-7577-4e0b-afc6-b07f437ea354',
              },
              {
                id: 'urn:subject:cc109c51-a083-413b-b497-7f80a0569a92',
              },

              {
                id: 'urn:subject:ea2822da-52f0-4517-bf01-c63f8e96f446',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:c499dbee-cfdd-4b76-8836-ae685db03baa',
              },
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:da2379d0-3c91-4e4d-94d7-fc42f69593d2',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:ea9e2be1-461d-4929-9dae-590e8cb9657f',
              },
              {
                id: 'urn:subject:f2ef1c73-d706-44e9-b1bd-7923842d6b4e',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:47678c7b-bc09-4fc8-b2d9-a2e3d709e105',
              },
              {
                id: 'urn:subject:1:576cc40f-cc74-4418-9721-9b15ffd29cff',
              },
              {
                id: 'urn:subject:6e2e2319-cb8a-4dd2-b382-e30f001633bb',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Musikk, dans og drama',
      nn: 'Musikk, dans og drama',
      en: 'Musikk, dans og drama',
    },
    url: {
      nb: 'musikk-dans-og-drama',
      nn: 'musikk-dans-og-drama',
      en: 'musikk-dans-og-drama',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av ulike programfag innen musikk, dans og drama. Du oppnår studiekompetanse og kan ta høyere utdanning. ',
        nn:
          'Utdanningsprogrammet består av ulike programfag innan musikk, dans og drama. Du oppnår studiekompetanse og kan ta høgare utdanning. ',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/B6lpbgh5.jpg' },
    grades: [
      {
        name: 'Vg1',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:4ad7fe49-b14a-4caf-8e19-ad402d1e2ce6',
              },
              {
                id: 'urn:subject:1:f18b0daa-6507-4025-8998-b8a11c8ccc70',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:605d33e0-1695-4540-9255-fc5e612e996f',
              },
              {
                id: 'urn:subject:1:a3c1b65a-c41f-4879-b650-32a13fe1801b',
              },
              {
                id: 'urn:subject:1:8bfd0a97-d456-448d-8b5f-3bc49e445b37',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:a5d7da3a-8a19-4a83-9b3f-3c855621df70',
              },
              {
                id: 'urn:subject:1:f7c5f36a-198d-4c38-a330-2957cf1a8325',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:50dfc86d-6566-4a45-a531-d32b82e8bfa1',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:d4511941-a1fc-4336-bc80-0a05c534a182',
              },
              {
                id: 'urn:subject:1:ff69c291-6374-4766-80c2-47d5840d8bbf',
              },
              {
                id: 'urn:subject:1:a45bba8f-61b7-4dc5-8609-126c4d9c7652',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },

              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },

              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },

              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },

              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg3',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:30bcefff-7577-4e0b-afc6-b07f437ea354',
              },
              {
                id: 'urn:subject:cc109c51-a083-413b-b497-7f80a0569a92',
              },

              {
                id: 'urn:subject:ea2822da-52f0-4517-bf01-c63f8e96f446',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:c499dbee-cfdd-4b76-8836-ae685db03baa',
              },
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:da2379d0-3c91-4e4d-94d7-fc42f69593d2',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:ea9e2be1-461d-4929-9dae-590e8cb9657f',
              },
              {
                id: 'urn:subject:f2ef1c73-d706-44e9-b1bd-7923842d6b4e',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:187c1484-84a5-474d-bf63-0c7915809a7d',
              },
              {
                id: 'urn:subject:1:576cc40f-cc74-4418-9721-9b15ffd29cff',
              },
              {
                id: 'urn:subject:6e2e2319-cb8a-4dd2-b382-e30f001633bb',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Naturbruk',
      nn: 'Naturbruk',
      en: 'Naturbruk',
    },
    url: {
      nb: 'naturbruk',
      nn: 'naturbruk',
      en: 'naturbruk',
    },
    meta: {
      description: {
        nb:
          'Naturbruk handler om å drive næring basert på naturressurser. Fagene dreier seg om tradisjonelle og nye driftsformer innenfor norske og samiske næringer.',
        nn:
          'Naturbruk handlar om å drive næring basert på naturressursar. Faga dreier seg om tradisjonelle og nye driftsformar innanfor norske og samiske næringar.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/vcus7cFa.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:644e5655-75e5-49c3-9f5a-e2a98271bb3d',
              },
              {
                id: 'urn:subject:169ba831-b3cd-4207-b9b8-7d06bf03328b',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:33d3fab4-4b5a-46b1-bd9d-6d7af8e79616',
              },
              {
                id: 'urn:subject:1:a51e0766-654d-4f71-be5d-78bc33a6663f',
              },
              {
                id: 'urn:subject:1:f2e831f5-2365-4ac8-bfce-4fc38323d91b',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        missingProgrammeSubjects: true,
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Påbygg',
      nn: 'Påbygg',
      en: 'Påbygg',
    },
    url: {
      nb: 'pabygg',
      nn: 'pabygg',
      en: 'pabygg',
    },
    image: { url: 'https://api.ndla.no/image-api/raw/lap5tLYu.jpg' },
    grades: [
      {
        name: 'Vg3',
        categories: [
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:187c1484-84a5-474d-bf63-0c7915809a7d',
              },
              {
                id: 'urn:subject:af91136f-7da8-4cf1-b0ba-0ea6acdf1489',
              },
              {
                id: 'urn:subject:ad7d24b5-57be-4eff-87e0-1eaf79b27825',
              },
              {
                id: 'urn:subject:846a7552-ea6c-4174-89a4-85d6ba48c96e',
              },
              {
                id: 'urn:subject:1:bb834c76-d1e4-46c4-8c0a-8f978bd2c956',
              },
            ],
          },
          {
            name: {
              nb: 'Valgfrie programfag',
              nn: 'Valfrie programfag',
              en: 'Valgfrie programfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:47678c7b-bc09-4fc8-b2d9-a2e3d709e105',
              },
              {
                id: 'urn:subject:1:a532138d-e16a-4046-a46e-bd5bc9487b8b',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Restaurant- og matfag',
      nn: 'Restaurant- og matfag',
      en: 'Restaurant- og matfag',
    },
    url: {
      nb: 'restaurant-og-matfag',
      nn: 'restaurant-og-matfag',
      en: 'restaurant-og-matfag',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogram med programfagene råvare, produksjon og kvalitet og bransje og arbeidsliv',
        nn:
          'Utdanningsprogram med programfaga råvare, produksjon og kvalitet og bransje og arbeidsliv',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/1pBrsVLW.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:fdefda2a-7d3a-4749-92cf-24ad466a20db',
              },
              {
                id: 'urn:subject:1:cd3a3bb8-eed2-4d02-8c21-b3dca5a2a11b',
              },
              {
                id: 'urn:subject:b0fb73bc-fc75-4be1-9b24-605d9de0f469',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:eba8b8d6-d312-4a57-baeb-04c7d9ba16f9',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:d78133ee-73be-4640-9eb6-50372cda2287',
              },
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:947772c4-d806-40d9-95b7-6dc855a37e13',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        categories: [
          {
            name: {
              nb: 'Kokk- og servitørfag',
              nn: 'Kokk- og servitørfag',
              en: 'Kokk- og servitørfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:09410bfa-5b0d-470b-8727-5006e711bc1f',
              },
              {
                id: 'urn:subject:1:485b4813-89ff-4404-b9dc-f37c22d48de5',
              },
              {
                id: 'urn:subject:1:9e515764-0ce6-49d5-8ecd-1cde8b08a33f',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Salg, service og reiseliv',
      nn: 'Sal, service og reiseliv',
      en: 'Salg, service og reiseliv',
    },
    url: {
      nb: 'salg-service-og-reiseliv',
      nn: 'salg-service-og-reiseliv',
      en: 'salg-service-og-reiseliv',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogrammet består av programfagene forretningsdrift, markedsføring og innovasjon og kultur og samhandling i tillegg til yrkesfaglig fordypning.',
        nn:
          'Utdanningsprogrammet består av programfaga forretningsdrift, markedsføring og innovasjon og kultur og samhandling i tillegg til yrkesfagleg fordjuping.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/5E4fooai.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:792414c5-896f-470a-9558-6101d7266237',
              },
              {
                id: 'urn:subject:1:be40ec3c-01ab-4e2e-af1a-a05fc85bcace',
              },
              {
                id: 'urn:subject:1:f18ad41e-d9c3-4428-8cb6-5eb852e45082',
              },
              {
                id: 'urn:subject:1:a1350efc-a249-4730-8bf7-0ef0556ddbcc',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:001c6405-79d5-4b9a-8b1b-002680265916',
              },
              {
                id: 'urn:subject:1:15af94d5-d647-4da9-aefc-f7e4b3bd44ff',
              },
              {
                id: 'urn:subject:1:721307df-c384-4a7f-ad69-668853c766c6',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        categories: [
          {
            name: {
              nb: 'Salg og reiseliv',
              nn: 'Sal og reiseliv',
              en: 'Salg og reiseliv',
            },
            subjects: [
              {
                id: 'urn:subject:1:59a988c6-4020-4e70-8329-4de68a19b6fe',
              },
              {
                id: 'urn:subject:1:4aef7156-a5ae-4476-8e81-6d2a4842143a',
              },
              {
                id: 'urn:subject:1:a7c337ca-d3b6-492f-ace2-b05c45f54e93',
              },
              {
                id: 'urn:subject:1:69c829b0-50f5-4944-bcaf-309da101a3d4',
              },
            ],
          },
          {
            name: {
              nb: 'Service, sikkerhet og administrasjon',
              nn: 'Service, sikkerheit og administrasjon',
              en: 'Service, sikkerhet og administrasjon',
            },
            subjects: [
              {
                id: 'urn:subject:1:e15e4240-1d05-4398-b63b-2177815eb61a',
              },
              {
                id: 'urn:subject:1:af71d86b-3464-4f35-a704-b21ebd556863',
              },
              {
                id: 'urn:subject:1:f9eb2b20-1c83-4292-8ad2-0fa8522da7cd',
              },
              {
                id: 'urn:subject:1:14fadc31-9799-4e46-ae3b-8294957e4d26',
              },
            ],
          },

          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Studiespesialisering',
      nn: 'Studiespesialisering',
      en: 'Studiespesialisering',
    },
    url: {
      nb: 'studiespesialisering',
      nn: 'studiespesialisering',
      en: 'studiespesialisering',
    },
    meta: {
      description: {
        nb:
          'På studiespesialisering velger du fordypning i enten realfag eller språk, samfunnsfag og økonomi. Du oppnår studiekompetanse og kan ta høyere utdanning. ',
        nn:
          'På studiespesialisering vel du fordjuping i anten realfag eller språk, samfunnsfag og økonomi. Du oppnår studiekompetanse og kan ta høgare utdanning. ',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/RPzTRrF3.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:f18b0daa-6507-4025-8998-b8a11c8ccc70',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:4ad7fe49-b14a-4caf-8e19-ad402d1e2ce6',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:8bfd0a97-d456-448d-8b5f-3bc49e445b37',
              },
              {
                id: 'urn:subject:1:a3c1b65a-c41f-4879-b650-32a13fe1801b',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:605d33e0-1695-4540-9255-fc5e612e996f',
              },
              {
                id: 'urn:subject:1:a5d7da3a-8a19-4a83-9b3f-3c855621df70',
              },
              {
                id: 'urn:subject:1:f7c5f36a-198d-4c38-a330-2957cf1a8325',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:ff69c291-6374-4766-80c2-47d5840d8bbf',
              },
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:d4511941-a1fc-4336-bc80-0a05c534a182',
              },
              {
                id: 'urn:subject:1:a45bba8f-61b7-4dc5-8609-126c4d9c7652',
              },
              {
                id: 'urn:subject:1:50dfc86d-6566-4a45-a531-d32b82e8bfa1',
              },
            ],
          },
          {
            name: {
              nb: 'Realfag',
              nn: 'Realfag',
              en: 'Realfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:734bd33b-da6d-49b0-bb34-c6df5b956f8e',
              },
              {
                id: 'urn:subject:1:b561f04f-d633-453e-b0ce-84985f97969b',
              },
              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
            ],
          },
          {
            name: {
              nb: 'Språk, samfunnsfag og økonomi',
              nn: 'Språk, samfunnsfag og økonomi',
              en: 'Språk, samfunnsfag og økonomi',
            },
            subjects: [
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },

              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },

              {
                id: 'urn:subject:1:47678c7b-bc09-4fc8-b2d9-a2e3d709e105',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:fb6ad516-0108-4059-acc3-3c5f13f49368',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:1:1a05c6c7-121e-49e2-933c-580da74afe1a',
              },
              {
                id: 'urn:subject:1:1d441d40-358a-47a8-8cd5-7a80382a9062',
              },
              {
                id: 'urn:subject:e18b8bf0-326b-45f6-8e95-982de8f34264',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg3',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:187c1484-84a5-474d-bf63-0c7915809a7d',
              },
              {
                id: 'urn:subject:cc109c51-a083-413b-b497-7f80a0569a92',
              },

              {
                id: 'urn:subject:30bcefff-7577-4e0b-afc6-b07f437ea354',
              },
              {
                id: 'urn:subject:ea2822da-52f0-4517-bf01-c63f8e96f446',
              },
            ],
          },
          {
            name: {
              nb: 'Realfag',
              nn: 'Realfag',
              en: 'Realfag',
            },
            subjects: [
              {
                id: 'urn:subject:c499dbee-cfdd-4b76-8836-ae685db03baa',
              },
              {
                id: 'urn:subject:da2379d0-3c91-4e4d-94d7-fc42f69593d2',
              },

              {
                id: 'urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21',
              },
            ],
          },
          {
            name: {
              nb: 'Språk, samfunnsfag og økonomi',
              nn: 'Språk, samfunnsfag og økonomi',
              en: 'Språk, samfunnsfag og økonomi',
            },
            subjects: [
              {
                id: 'urn:subject:6e2e2319-cb8a-4dd2-b382-e30f001633bb',
              },
              {
                id: 'urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357',
              },
              {
                id: 'urn:subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1',
              },
              {
                id: 'urn:subject:1:058bdbdb-aa5a-4a29-88fb-45e664999417',
              },
              {
                id: 'urn:subject:f2ef1c73-d706-44e9-b1bd-7923842d6b4e',
              },
              {
                id: 'urn:subject:ea9e2be1-461d-4929-9dae-590e8cb9657f',
              },
              {
                id: 'urn:subject:1:3170610c-6a5a-4da5-aeba-adb247aae48c',
              },
              {
                id: 'urn:subject:e18b8bf0-326b-45f6-8e95-982de8f34264',
              },
              {
                id: 'urn:subject:1:1f1865fc-e4cc-48a0-918f-3530485ec424',
              },
              {
                id: 'urn:subject:1:576cc40f-cc74-4418-9721-9b15ffd29cff',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: {
      nb: 'Teknologi- og industrifag',
      nn: 'Teknologi- og industrifag',
      en: 'Teknologi- og industrifag',
    },
    url: {
      nb: 'teknologi-og-industrifag',
      nn: 'teknologi-og-industrifag',
      en: 'teknologi-og-industrifag',
    },
    meta: {
      description: {
        nb:
          'Utdanningsprogram med programfagene produksjon og tjenester, konstruksjons- og styringsteknikk og produktivitet og kvalitetsstyring og YFF.',
        nn:
          'Utdanningsprogram med programfaga produksjon og tjenester, konstruksjons- og styringsteknikk og produktivitet og kvalitetsstyring og YFF.',
      },
    },
    image: { url: 'https://api.ndla.no/image-api/raw/sq1cLlG0.jpg' },
    grades: [
      {
        name: 'Vg1',
        categories: [
          {
            name: undefined,
            subjects: [
              {
                id: 'urn:subject:1:5a5cac3f-46ff-4f4d-ba95-b256a706ec48',
              },
              {
                id: 'urn:subject:1:84d4651b-fc52-4876-a066-f8567ecf79a6',
              },
              {
                id: 'urn:subject:1:29212872-62d6-4555-89fd-b85e7f3f9411',
              },
              {
                id: 'urn:subject:1:59f2f355-ebf6-4a8c-a0a8-ccd229d2e901',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:9b93cd9e-a45c-428c-a8fb-b4955169efdf',
              },
              {
                id: 'urn:subject:1:ca607ca1-4dd0-4bbd-954f-67461f4b96fc',
              },
              {
                id: 'urn:subject:1:3b74fa5e-aeb8-4bc3-b771-fb2c0230b5f4',
              },
              {
                id: 'urn:subject:1:2dc9a180-e501-46ba-93b4-f665f59bdced',
              },
              {
                id: 'urn:subject:1:0d8458e9-632b-4bdf-977c-cb04ccde02bd',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
      {
        name: 'Vg2',
        categories: [
          {
            name: {
              nb: 'Brønnteknikk',
              nn: 'Brønnteknikk',
              en: 'Brønnteknikk',
            },
            subjects: [
              {
                id: 'urn:subject:1:98cbb757-a718-4275-b87a-2248cde4b58d',
              },
              {
                id: 'urn:subject:1:6951e039-c23e-483f-94bf-2194a1fb197d',
              },
              {
                id: 'urn:subject:1:6eb22154-3d19-4551-93f5-f137bb5abba8',
              },
              {
                id: 'urn:subject:1:0b8e17fe-2387-4e16-9b88-8517012fdf5f',
              },
            ],
          },
          {
            name: {
              nb: 'Transport og logistikk',
              nn: 'Transport og logistikk',
              en: 'Transport og logistikk',
            },
            subjects: [
              {
                id: 'urn:subject:1:67a5a464-ee5b-4b21-b383-fb744460dce4',
              },
              {
                id: 'urn:subject:1:aa902796-db72-4f3f-ade1-63e4dba5653b',
              },
              {
                id: 'urn:subject:1:4e709986-3cbf-4fa9-8195-46bd8e0c124b',
              },
            ],
          },
          {
            name: {
              nb: 'Fellesfag',
              nn: 'Fellesfag',
              en: 'Fellesfag',
            },
            subjects: [
              {
                id: 'urn:subject:1:fa2a7d6a-5e8e-4976-82c0-9a1266684c1c',
              },
              {
                id: 'urn:subject:1:51a7271b-a9d5-4205-bade-1c125a8650b5',
              },
              {
                id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              },
              {
                id: 'urn:subject:1:962dd49d-72e8-4576-9efb-69d93a95402e',
              },
              {
                id: 'urn:subject:1:11c4696f-e844-4c98-8df7-49d43f59ec33',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const getProgrammeBySlug = (slug: string, locale: LocaleType) => {
  return programmes.find(item => {
    if (item.url) {
      if (locale) {
        return item.url[locale] === slug;
      } else {
        return Object.keys(item.url).find(
          lang => item.url[lang as LocaleType] === slug,
        );
      }
    }
    return false;
  });
};
