# Roam Cast API Contracts (MVP)

## Auth
### POST /auth/login
Request:
```json
{ "email": "walker@roamcast.dev" }
```
Response:
```json
{ "token": "jwt", "user": { "id": "...", "email": "..." } }
```

### GET /auth/me
Header: `Authorization: Bearer <jwt>`
Response: user + preferences

## POIs
### GET /pois/nearby?lat=-37.81&lng=144.96&radius=30
Response: array with distance meters, interest score, summary

### GET /pois/:id
Response: full POI details

## Roaming
### POST /roaming/check
Request:
```json
{ "lat": -37.81, "lng": 144.96, "radius": 30, "recentPoiIds": ["..."] }
```
Response:
```json
{ "candidate": { "poiId": "...", "name": "...", "distanceMeters": 18.2, "score": 0.93 } }
```

## Stories
### GET /stories/:poiId
Response:
```json
{ "shortStory": "...", "longStory": "...", "transcript": "...", "audioUrl": "/audio/mock-...mp3" }
```

### POST /stories/generate/:poiId
Regenerates story + audio via provider abstraction.

## Preferences
### PATCH /me/preferences
Request:
```json
{ "categories": ["history", "architecture", "food"] }
```

## Interactions
### POST /interactions
Request:
```json
{ "poiId": "...", "action": "accepted", "metadata": {"source":"roaming_prompt"} }
```
