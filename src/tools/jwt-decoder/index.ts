import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const jwtDecoder: ToolDefinition = {
  slug: "jwt-decoder",
  category: "developer",
  name: "JWT Decoder",
  shortDescription: "JWT decoder: view header, payload and claims and check expiry in your browser.",
  keywords: [
    "jwt decoder",
    "decode jwt",
    "jwt decode online",
    "json web token decoder",
    "jwt debugger",
    "jwt viewer",
    "jwt parser",
    "jwt claims",
    "jwt expiration check",
    "decode bearer token",
    "jwt payload",
    "jwt.io alternative",
    "access token decoder",
    "id token decoder",
  ],
  related: ["base64", "json-formatter", "hash-generator"],
  icon: "jwt",
  popular: true,
  component: Tool,
  content: {
    en: {
      title: "JWT Decoder Online: Decode JSON Web Token Claims",
      description:
        "Free JWT decoder: paste a JSON Web Token to view header, payload and claims with readable dates and an expiry check. Decodes in your browser, no upload.",
      intro: [
        "This JWT decoder splits a JSON Web Token into its header, payload and signature and pretty prints the two JSON parts side by side, so you can see what a token really says. A JWT is three base64url-encoded segments joined by dots: the header names the signing algorithm, the payload carries claims about the user or session, and the signature proves who issued it. The first two segments are encoded, not encrypted, which is why anyone holding a token can read them. Developers use this page to debug login flows and OAuth or OpenID Connect integrations. Decoding runs client-side in your browser and the token is never transmitted.",
        "Registered claims such as iss, sub, aud, exp, iat, nbf and jti are listed in a table with Unix timestamps converted to local dates and a live countdown, and a badge shows whether the token is Valid, Expired or Not yet valid. The algorithm and type from the header appear as chips, so an unexpected alg value stands out.",
        "Compared with a hosted debugger, this page makes no network request and does not attempt verification, so there is no secret to enter and nothing to leak. Prefer a development or expired token whenever you can.",
      ],
      howTo: [
        "Paste the full token into the Token box; a leading Bearer prefix is stripped automatically.",
        "Or click Load sample to explore an example token.",
        "Read the status badge and the Algorithm and Type chips that appear under the notice.",
        "Inspect the decoded Header and Payload, both shown as indented JSON with their own Copy buttons.",
        "Scroll to the Registered claims table to see iat, nbf and exp as local dates with a relative countdown.",
        "Review the Signature section at the bottom, which is not verified, then click Clear to decode another token.",
      ],
      features: [
        "Decodes header, payload and signature segments of any JWS-style token",
        "Strips a Bearer prefix and tolerates missing base64url padding",
        "Registered claims table with exp, iat and nbf as local dates",
        "Valid, Expired, Not yet valid or No expiry claim badge",
        "Algorithm and type chips lifted from the header",
        "Clear error messages for malformed tokens",
        "Runs entirely in the browser; nothing is uploaded",
      ],
      faq: [
        {
          question: "How do I decode a JWT without the secret?",
          answer:
            "You do not need the secret to decode a JWT, only to verify it. The header and payload are plain base64url-encoded JSON, so any decoder can read them. The secret or private key is used only to create the signature, and the matching key is needed to check it. Decoding tells you what a token claims; verification tells you whether to believe it.",
        },
        {
          question: "Does this tool verify the JWT signature?",
          answer:
            "No. Decoding only reveals the contents; it says nothing about whether the token is authentic. Verification requires the issuer's secret key for HMAC algorithms such as HS256, or the public key for RS256 and ES256, and must be done by the server that trusts the token. A token that decodes cleanly here can still be forged or tampered with.",
        },
        {
          question: "What does the exp claim mean and why does my token show as expired?",
          answer:
            "exp is the expiration time as a Unix timestamp in seconds, not milliseconds. A verifier must reject the token once the current time reaches exp. This page compares exp with your computer's clock, so a wrong system clock gives a wrong badge. nbf is the earliest time the token may be accepted, and iat records when it was issued.",
        },
        {
          question: "Is it safe to paste a token here?",
          answer:
            "This page decodes in your browser and makes no network requests, so the token stays on your machine. Even so, treat tokens like passwords: a valid access token lets anyone holding it act as you until it expires. Prefer expired or development tokens, and never paste production tokens into a site you do not trust.",
        },
        {
          question: "Why can I read the payload without a key?",
          answer:
            "Because a standard JWT, technically a JWS, is signed rather than encrypted. Base64url is a plain reversible encoding, so the header and payload are effectively public to anyone who obtains the token. Never put secrets such as passwords or card numbers in a payload; if confidentiality is required, use JWE, which encrypts the payload, or keep the data server-side.",
        },
        {
          question: "Why does the decoder say my token is malformed?",
          answer:
            "A JWT must have exactly three dot-separated parts, and the first two must be valid base64url that decodes to JSON objects. Common problems are line breaks introduced when copying, a truncated token, quotes copied from a JSON response, or an opaque session ID that was never a JWT. Paste the raw value again and check that it contains exactly two dots.",
        },
        {
          question: "What is the difference between a JWT, an access token and an ID token?",
          answer:
            "JWT is a format; access token and ID token are roles. In OAuth 2.0 an access token is presented to an API and may be a JWT or an opaque string the API looks up. In OpenID Connect an ID token is always a JWT, is meant for the client application, and describes the authenticated user. Both decode here if they are JWTs.",
        },
      ],
    },
  },
};
