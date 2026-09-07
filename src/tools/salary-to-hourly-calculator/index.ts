import type { ToolDefinition } from "../types";

export const salaryToHourlyCalculator: ToolDefinition = {
  slug: "salary-to-hourly-calculator",
  category: "finance",
  name: "Salary to Hourly Calculator",
  shortDescription: "Salary to hourly calculator: convert yearly, monthly and hourly pay both ways.",
  keywords: [
    "salary to hourly calculator",
    "salary to hourly",
    "hourly to salary calculator",
    "annual salary to hourly rate",
    "convert salary to hourly",
    "hourly wage calculator",
    "yearly salary to hourly wage",
    "monthly salary to hourly",
    "hourly rate to annual salary",
    "how much is my salary per hour",
    "biweekly pay calculator",
    "paycheck calculator",
    "what is 60000 a year hourly",
  ],
  related: ["percentage-calculator", "compound-interest-calculator", "tip-calculator"],
  icon: "$/h",
  popular: true,
  content: {
    en: {
      title: "Salary to Hourly Calculator: Convert Pay Rates",
      description:
        "Salary to hourly calculator that converts annual, monthly or hourly pay into every pay period, adjusts for paid time off and shows what a raise is worth.",
      intro: [
        "This salary to hourly calculator converts an annual salary, a monthly paycheck or an hourly rate into every common pay period at once: hourly, daily, weekly, biweekly, semi-monthly, monthly and annual. Tell it which figure you know, set your hours per week and weeks per year, and it fills in the rest as you type. Add paid time off days to see your true rate per hour actually worked, and try a raise percentage to see the new hourly and annual amounts side by side. Everything runs in your browser, so your pay details never leave your device.",
        "The default of 40 hours and 52 weeks gives 2,080 paid hours a year, the figure most employers and job listings assume. Lower the weeks if part of your year is unpaid and every figure adjusts. Daily pay divides weekly hours by five, biweekly pay is two weeks of earnings, and semi-monthly pay is the annual amount divided by 24.",
        "Use it to compare a salaried offer with contract work, check that an hourly quote matches a salary, or turn a percentage raise into money you can see. The FAQ covers the formula, the 2,080-hour rule and how paid time off changes your effective rate.",
      ],
      howTo: [
        "Under I know my, choose Annual salary, Hourly rate or Monthly pay, then type the figure you know in the amount box.",
        "Set Hours per week (default 40) and Weeks per year (default 52). Lower the weeks if some of your year is unpaid.",
        "Optionally enter Paid time off in days; the Hours worked / year and Per hour worked stats show your effective rate.",
        "Pick your currency from the Currency select to format every result.",
        "Read the highlighted stat and the Pay period equivalents table for every pay period from hourly to annual.",
        "Enter a percentage in the After a raise section to see the new hourly and annual figures.",
      ],
      features: [
        "Convert from annual salary, hourly rate or monthly pay in one tool",
        "Table of equivalents for every pay period from hourly to annual",
        "Adjustable hours per week and weeks per year for part-time or unpaid weeks",
        "Paid time off input shows your true rate per hour actually worked",
        "Raise calculator converts a percentage into new hourly and annual pay",
        "Seven currencies with locale-aware formatting",
        "Formula notes shown next to the results",
        "Runs entirely in your browser with nothing stored",
      ],
      faq: [
        {
          question: "How do I convert an annual salary to an hourly rate?",
          answer:
            "Divide the salary by the paid hours in a year. With a 40-hour week and 52 weeks that is 2,080 hours, so a 60,000 salary is 60,000 / 2,080 = 28.85 per hour. At 37.5 hours a week the divisor drops to 1,950 and the same salary is 30.77 per hour. The calculator applies this formula with whatever hours and weeks you enter.",
        },
        {
          question: "How much is 25 an hour per year?",
          answer:
            "Multiply the hourly rate by hours per week and weeks per year. At 40 hours and 52 weeks, 25 x 40 x 52 = 52,000 a year, about 4,333 a month or 2,000 every two weeks. With two unpaid weeks, use 50 weeks and the annual figure becomes 50,000. Overtime and bonuses are not included unless you add them to the rate.",
        },
        {
          question: "Why does the calculator use 2,080 hours a year?",
          answer:
            "2,080 is 40 hours multiplied by 52 weeks, the standard full-time year used by most employers, payroll systems and job listings in the United States. It counts paid hours, including paid holidays and vacation, not hours actually worked. Some payroll systems use 2,087 to average in leap years, but the difference is under half a percent.",
        },
        {
          question: "How does paid time off change my hourly rate?",
          answer:
            "Paid days off do not change your salary, but they reduce the hours you actually work, so your effective rate per hour worked goes up. On 60,000 a year with 15 days of PTO and 8-hour days, you work 2,080 - 120 = 1,960 hours, which is 30.61 per hour worked instead of 28.85. The tool shows this as Per hour worked.",
        },
        {
          question: "What is the difference between biweekly and semi-monthly pay?",
          answer:
            "Biweekly pay arrives every two weeks, giving 26 paychecks a year and 27 in some years. Semi-monthly pay arrives twice a month on fixed dates, usually the 15th and the last day, giving exactly 24. A 52,000 salary is 2,000 per biweekly check but 2,166.67 per semi-monthly check. The annual total is the same; only the size and timing differ.",
        },
        {
          question: "How do I work out what a raise is worth per hour?",
          answer:
            "Multiply your current hourly rate and annual salary by 1 plus the raise percentage. A 5% raise on 28.85 an hour gives 28.85 x 1.05 = 30.29, and on 60,000 a year gives 63,000, or 250 more per month before tax. Enter the percentage in the After a raise section to see both new figures instantly.",
        },
        {
          question: "Is a higher hourly rate always better than a salary?",
          answer:
            "Not necessarily. A contractor quoting 40 an hour looks like 83,200 a year at 2,080 hours, but contractors usually get no paid vacation, holidays or employer benefits, and may have gaps between projects. To compare fairly, reduce the weeks per year to the weeks you expect to be paid and add the cost of benefits you would buy yourself.",
        },
      ],
    },
  },
};
