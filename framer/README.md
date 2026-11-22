# Outdooroots — Framer code components

Phase-one prototype of the Outdooroots platform brief, built as Framer code
components. All records in `ORData.tsx` are labeled sample data (no real
prices, bookings, credentials or reviews).

| File | Page | Notes |
| --- | --- | --- |
| `ORData.tsx` | — | Content model + sample records (places, experiences, hosts, articles, map points, sample profile) |
| `ORKit.tsx` | — | Tokens, header + mobile tab bar, footer, cards, radar, enquiry form, modal |
| `ORHome.tsx` | `/` | Homepage sequence from the brief |
| `ORExplore.tsx` | `/explorar` | Search + element / quest / level filters (state kept in the URL) |
| `ORExperience.tsx` | `/experiencia?id=…` | Experience detail, enquiry modal, saved missions (this device only) |
| `ORDestinations.tsx` | `/destinos` | Country → region → destination |
| `ORHosts.tsx` | `/anfitriones` (`?id=…`) | Host list and sample profiles (verification pending) |
| `ORMap.tsx` | `/mapa` | Schematic map + list, 50/100/150 km radius, category filter |
| `ORProgress.tsx` | `/progreso` | Capability radar vs mission, table, disciplines, knowledge, path |
| `ORMagazine.tsx` | `/revista` (`?id=…`) | Articles |
| `ORClubRoots.tsx` | `/club-roots` | Planned benefits + interest form |

Forms only report success after the Outdooroots backend (`POST /api/bookings`)
stores the request. Set each component's **API URL** property once the backend
is deployed; until then they generate a local draft and say so.
