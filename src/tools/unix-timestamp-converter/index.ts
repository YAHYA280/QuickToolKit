import type { ToolDefinition } from "../types";

export const unixTimestampConverter: ToolDefinition = {
  slug: "unix-timestamp-converter",
  category: "developer",
  name: "Unix Timestamp Converter",
  shortDescription: "Unix timestamp converter: epoch seconds or milliseconds to date and back, live.",
  keywords: [
    "unix timestamp converter",
    "epoch converter",
    "unix time converter",
    "timestamp to date",
    "date to timestamp",
    "epoch time converter",
    "unix time now",
    "current unix timestamp",
    "milliseconds to date",
    "epoch to date online",
    "convert timestamp to date",
    "unix epoch time",
    "iso 8601 converter",
  ],
  related: ["jwt-decoder", "json-formatter", "uuid-generator"],
  icon: "ts",
  popular: true,
  content: {
    en: {
      title: "Unix Timestamp Converter: Epoch to Date & Back",
      description:
        "Unix timestamp converter with a live epoch clock. Turn seconds, milliseconds or microseconds into UTC, local and relative dates, or dates into timestamps.",
      intro: [
        "This Unix timestamp converter turns epoch time into a readable date and a date back into a timestamp, with a live clock showing the current Unix time in seconds, milliseconds and ISO 8601. Paste any value and the tool detects seconds, milliseconds, microseconds or nanoseconds from the digit count, then lists UTC, RFC 2822 and local time, relative time, day of week, day of year and ISO week. Everything runs in your browser with the built-in Date and Intl APIs, so log lines and tokens never leave your machine.",
        "It is built for developers reading API responses, database rows and JWT claims, for ops engineers comparing logs across regions, and for anyone handed a number like 1700000000 who wants to know what day it was. The Date to timestamp section lets you interpret a picked date as local time or UTC, the most common source of off-by-hours bugs.",
        "A quick reference table lists landmark values such as the epoch, the billionth second and the 32-bit limit of January 2038; click Load to send one to the converter.",
      ],
      howTo: [
        "Read the Current Unix time tile at the top; the Copy buttons under the tiles copy the seconds, milliseconds or ISO value.",
        "Under Timestamp to date, paste a number such as 1700000000 or 1700000000123, or press Now. The Detected chip shows which unit was assumed.",
        "Copy any row from the results table: UTC ISO 8601, RFC 2822, local time, relative time, day of week, day of year or ISO week.",
        "Under Date to timestamp, pick a date and time with the picker or press Now to fill in the current moment.",
        "Choose Local or UTC in the Interpret as dropdown to say which zone the date was written in, then copy the seconds, milliseconds or ISO output.",
        "Click Load next to any value in the Quick reference table to send it to the converter.",
      ],
      features: [
        "Live current Unix time in seconds, milliseconds and ISO 8601",
        "Detects seconds, milliseconds, microseconds and nanoseconds",
        "UTC, RFC 2822, local time with zone name and relative time",
        "Day of week, day of year and ISO week number",
        "Date to timestamp with Local or UTC interpretation",
        "Negative timestamps and decimal seconds accepted",
        "Quick reference of landmark epochs including the 2038 limit",
        "Client-side only; nothing is sent to a server",
      ],
      faq: [
        {
          question: "What is a Unix timestamp?",
          answer:
            "A Unix timestamp, also called epoch time or POSIX time, is the number of seconds elapsed since 00:00:00 UTC on 1 January 1970, not counting leap seconds. It is a single integer independent of time zones, which makes it convenient for storing and comparing moments in databases, logs and APIs. For example, 1700000000 is 14 November 2023 at 22:13:20 UTC.",
        },
        {
          question: "How do I tell seconds from milliseconds in a timestamp?",
          answer:
            "Count the digits. Current times in seconds have 10 digits (around 1.7 billion), in milliseconds 13, in microseconds 16 and in nanoseconds 19. This converter detects the unit from the digit count and shows a chip with its guess. If a date comes out in early 1970 or in the year 55000, divide or multiply by 1000 and try again.",
        },
        {
          question: "What is the year 2038 problem?",
          answer:
            "Many older systems store Unix time in a signed 32-bit integer, which reaches its maximum of 2147483647 at 03:14:07 UTC on 19 January 2038. One second later the counter wraps to a negative number that reads as December 1901. Modern 64-bit systems and current languages are unaffected, but embedded devices, old file formats and legacy databases may still be at risk.",
        },
        {
          question: "Do Unix timestamps count leap seconds?",
          answer:
            "No. Unix time assumes every day has exactly 86400 seconds, so when a leap second is added to UTC the Unix clock repeats or smears a second instead of counting it. A Unix timestamp is therefore not the exact number of SI seconds since 1970; it is 27 seconds short as of the last leap second in 2016.",
        },
        {
          question: "Why does the converted date differ from what my colleague sees?",
          answer:
            "A timestamp is absolute, but the local time row depends on the browser time zone of whoever is looking. The tool prints the detected zone in that row's label, and the UTC row is the same for everyone, so compare that one. When converting a date, choose UTC in the Interpret as dropdown if it was written in UTC, otherwise the result shifts by your offset.",
        },
        {
          question: "How do JavaScript Date.now() and Python time.time() differ?",
          answer:
            "JavaScript Date.now() returns an integer number of milliseconds, so a value like 1700000000123 has 13 digits. Python time.time() returns a float number of seconds such as 1700000000.123456, and int(time.time()) gives the 10-digit form. Java System.currentTimeMillis() matches JavaScript, while Go time.Now().Unix() and the shell command date +%s return seconds. Paste either form here and the unit is detected automatically, including decimal seconds.",
        },
        {
          question: "Is the current Unix time shown here accurate?",
          answer:
            "It reads your device clock through Date.now() once a second, so it is as accurate as your computer or phone, which is usually synchronised over NTP to within a fraction of a second. Nothing is fetched from a server. If it looks wrong, check your operating system time settings. The value is always UTC based, because Unix time has no time zone.",
        },
      ],
    },
  },
};
