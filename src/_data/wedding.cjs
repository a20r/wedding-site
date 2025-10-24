const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const YAML = require('yaml');
const { z } = require('zod');

const timeWithOffset = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/,
    'Expected RFC3339 timestamp with timezone offset (e.g. 2026-07-11T15:00:00-04:00)'
  );

const lodgingPlaceSchema = z.object({
  name: z.string(),
  type: z.string(),
  url: z.string().url().or(z.literal('')),
  distance_minutes: z.number().nonnegative(),
  price_range: z.enum(['$', '$$', '$$$']),
  status: z.enum(['on_hold', 'available', 'full']),
  min_nights: z.number().int().nonnegative(),
  family_friendly: z.boolean(),
  pet_friendly: z.boolean(),
  lat: z.number().nullable(),
  lng: z.number().nullable()
});

const schema = z.object({
  site: z.object({
    title: z.string(),
    couple: z.object({
      alex_blurb: z.string(),
      lily_blurb: z.string()
    }),
    date_iso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timezone: z.string(),
    venue: z.object({
      name: z.string(),
      address: z.string(),
      lat: z.number().nullable(),
      lng: z.number().nullable()
    }),
    town: z.string(),
    state: z.string(),
    rsvp_typeform_url: z.string().url(),
    hero_tagline: z.string(),
    show_countdown: z.boolean(),
    map_enabled: z.boolean(),
    analytics: z.object({
      enabled: z.boolean(),
      provider: z.enum(['', 'plausible', 'gtag']),
      id: z.string()
    })
  }),
  sections: z.object({
    rsvp: z.object({ enabled: z.boolean() }),
    schedule: z.object({
      enabled: z.boolean(),
      note: z.string(),
      items: z.array(
        z.object({
          time_rfc3339: timeWithOffset,
          label: z.string(),
          location: z.string(),
          details: z.string()
        })
      )
    }),
    travel: z.object({
      enabled: z.boolean(),
      intro: z.string(),
      airports: z.array(
        z.object({
          code: z.string(),
          name: z.string(),
          note: z.string()
        })
      ),
      tips: z.array(z.string())
    }),
    lodging: z.object({
      enabled: z.boolean(),
      intro: z.string(),
      filters: z.object({
        price: z.boolean(),
        pet_friendly: z.boolean(),
        family_friendly: z.boolean(),
        distance: z.boolean()
      }),
      places: z.array(lodgingPlaceSchema)
    }),
    activities: z.object({
      enabled: z.boolean(),
      intro: z.string(),
      spots: z.array(
        z.object({
          name: z.string(),
          blurb: z.string(),
          url: z.string().url().or(z.literal(''))
        })
      )
    }),
    hikes: z.object({
      enabled: z.boolean(),
      intro: z.string(),
      list: z.array(
        z.object({
          name: z.string(),
          blurb: z.string(),
          url: z.string().url().or(z.literal(''))
        })
      )
    }),
    mtb: z.object({
      enabled: z.boolean(),
      intro: z.string(),
      trails: z.array(
        z.object({
          name: z.string(),
          difficulty: z.string(),
          url: z.string().url().or(z.literal(''))
        })
      )
    }),
    faq: z.object({
      enabled: z.boolean(),
      items: z.array(
        z.object({
          q: z.string(),
          a: z.string()
        })
      )
    }),
    registry: z.object({
      enabled: z.boolean(),
      title: z.string(),
      intro: z.string(),
      items: z.array(
        z.object({
          label: z.string(),
          url: z.string().url().or(z.literal(''))
        })
      )
    })
  }),
  theme: z.object({
    palette: z.object({
      bg: z.string(),
      ink: z.string(),
      accent: z.string(),
      accent2: z.string(),
      sky: z.string(),
      cream: z.string()
    }),
    fonts: z.object({
      use_webfonts: z.boolean(),
      heading: z.string(),
      body: z.string()
    })
  }),
  easter_eggs: z.object({
    konami_enabled: z.boolean()
  })
});

const file = resolve(process.cwd(), 'src/_data/config.yaml');
const raw = readFileSync(file, 'utf8');
const parsed = YAML.parse(raw, { intAsBigInt: false });
const result = schema.safeParse(parsed);

if (!result.success) {
  const issues = result.error.issues
    .map((issue) => `- ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`config.yaml failed validation:\n${issues}`);
}

const data = result.data;
data.sections.lodging.has_coordinates = data.sections.lodging.places.some(
  (place) => place.lat !== null && place.lng !== null
);

module.exports = data;
