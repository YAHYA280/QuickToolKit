import type { ToolDefinition } from "../types";

export const cronExpressionGenerator: ToolDefinition = {
  slug: "cron-expression-generator",
  category: "developer",
  name: "Cron Expression Generator",
  shortDescription: "Cron expression generator with plain English preview and next run times.",
  keywords: [
    "cron expression generator",
    "cron generator",
    "cron expression",
    "crontab generator",
    "cron schedule generator",
    "cron expression parser",
    "cron job generator",
    "crontab syntax",
    "cron every 5 minutes",
    "cron expression examples",
    "cron next run time",
    "cron builder online",
  ],
  related: ["unix-timestamp-converter", "regex-tester", "chmod-calculator"],
  icon: "* *",
  popular: true,
  content: {
    en: {
      title: "Cron Expression Generator & Schedule Explainer",
      description:
        "Cron expression generator and parser: build a schedule from dropdowns, read it in plain English and preview the next 5 run times. Free, in your browser.",
      intro: [
        "This cron expression generator builds a five field crontab schedule from simple dropdowns, so you never have to remember whether the hour or the minute comes first. Pick a mode for each field, such as every N minutes, a list of specific hours or a range of weekdays, and the expression updates live along with a plain English description and the next five run times. Everything runs in your browser: nothing you type is sent to a server, which makes it safe to test production job schedules.",
        "Switch to Parse mode to paste an expression from an existing crontab, a Kubernetes CronJob or a GitHub Actions workflow. The tool validates each field, explains the schedule and lists upcoming run times in your local time zone, so you catch a mistake before the job fires at 3 am instead of 3 pm.",
        "Presets cover the schedules most people need, from every minute to the first of the month, and the reference table lists the allowed values and special characters for each field.",
      ],
      howTo: [
        "Choose Build to compose a schedule or Parse to check an existing expression.",
        "In Build mode, set each field to Every, Every N, Specific values or Range and fill in the numbers or tick the values.",
        "Read the generated expression in the large chip and the plain English Meaning, then click Copy.",
        "Check the Next 5 runs list to confirm the schedule fires when you expect; click Recalculate to refresh it.",
        "Click a preset such as Weekdays 9am to load a common schedule.",
        "In Parse mode, paste an expression into the Cron expression box; invalid fields are reported with an error.",
      ],
      features: [
        "Five field builder with Every, Every N, Specific values and Range modes",
        "Plain English description powered by cronstrue",
        "Next five run times in your local time zone",
        "Parse mode that validates existing crontab expressions",
        "Step values, lists, ranges and JAN-DEC / SUN-SAT names",
        "@hourly, @daily, @weekly, @monthly and @yearly aliases",
        "Six presets for the most common schedules",
        "Field reference table with allowed values",
      ],
      faq: [
        {
          question: "What are the five fields in a cron expression?",
          answer:
            "A standard cron expression has five space separated fields: minute (0 to 59), hour (0 to 23), day of month (1 to 31), month (1 to 12 or JAN to DEC) and day of week (0 to 6 or SUN to SAT, where both 0 and 7 mean Sunday). An asterisk means every value, so * * * * * runs every minute.",
        },
        {
          question: "What does */5 mean in cron?",
          answer:
            "The slash defines a step. */5 in the minute field means every value from 0 to 59 that is divisible by 5, so the job runs at :00, :05, :10 and so on, twelve times an hour. Steps combine with ranges: 9-17/2 in the hour field runs at 9, 11, 13, 15 and 17. Steps count from the start of the range, not from when the job was installed.",
        },
        {
          question: "What happens when both day of month and day of week are set?",
          answer:
            "In standard Vixie cron, if both the day of month and day of week fields are restricted, the job runs when either one matches, not both. So 0 9 1 * MON runs on the first of every month and also on every Monday. For the first Monday of the month, add a test inside the script or use a scheduler such as Quartz that supports the # operator.",
        },
        {
          question: "Which time zone does a cron job use?",
          answer:
            "Classic cron runs in the time zone of the server, usually whatever TZ is set to for the cron daemon, which is often UTC on cloud machines. The next run times on this page use your browser's local time zone, so if your server is in UTC and you are not, adjust the hour field. Kubernetes CronJobs and many cloud schedulers accept an explicit timeZone field.",
        },
        {
          question: "What do @hourly, @daily and the other aliases mean?",
          answer:
            "Most cron implementations accept shorthand names in place of the five fields. @hourly is 0 * * * *, @daily and @midnight are 0 0 * * *, @weekly is 0 0 * * 0, @monthly is 0 0 1 * * and @yearly or @annually is 0 0 1 1 *. Parse mode expands the aliases so you can see the underlying schedule.",
        },
        {
          question: "Why does my cron job not run at the time I expect?",
          answer:
            "The most common causes are a swapped minute and hour, a server in a different time zone from you, a PATH that differs from your shell, or day of month and day of week both being set and behaving as an OR. Paste the expression into Parse mode and compare the next run list with what you intended, then check the cron log on the server.",
        },
        {
          question: "Can I schedule a job every 90 minutes or every other week with cron?",
          answer:
            "Not with a single standard expression. Steps reset at the end of each field, so */90 in the minute field is invalid. Every 90 minutes needs two lines, such as 0 0-21/3 * * * and 30 1-22/3 * * *. Every other week is usually done by running weekly and having the script exit early based on the ISO week number.",
        },
      ],
    },
  },
};
