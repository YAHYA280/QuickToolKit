import type { ToolDefinition } from "../types";

export const compoundInterestCalculator: ToolDefinition = {
  slug: "compound-interest-calculator",
  category: "finance",
  name: "Compound Interest Calculator",
  shortDescription: "Compound interest calculator with monthly contributions and a yearly table.",
  keywords: [
    "compound interest calculator",
    "compound interest",
    "savings calculator",
    "investment calculator",
    "interest calculator",
    "compound interest formula",
    "monthly compound interest",
    "daily compound interest",
    "apy calculator",
    "future value calculator",
    "savings growth calculator",
    "retirement savings calculator",
    "monthly contribution",
    "interest on interest",
  ],
  related: ["loan-calculator", "percentage-calculator"],
  icon: "%^",
  content: {
    en: {
      title: "Compound Interest Calculator with Monthly Deposits",
      description:
        "Free compound interest calculator: enter a deposit, monthly contribution, rate and years to see the final balance, interest earned, APY and a yearly table.",
      intro: [
        "This compound interest calculator projects how a savings account or investment grows when you start with an initial amount, add a fixed contribution every month and let the balance compound at a chosen rate and frequency for up to sixty years. Compound interest means you earn interest not only on the money you deposit but also on the interest already credited. The calculator reports the final balance, how much of it came from your own contributions, how much came from interest, and the effective annual rate for the chosen compounding frequency. It suits savers, students and anyone planning for retirement. Calculations run client-side in your browser.",
        "The year-by-year table and the stacked bar make it obvious how the interest share overtakes contributions in later years, which is the core argument for starting early. With 10,000 up front, 200 a month and 7% compounded monthly, the balance after twenty years is about 144,500, of which roughly 86,500 is interest. Try changing the rate by one percentage point or the horizon by five years to see how sensitive the result is.",
        "Results are nominal and before tax, so treat them as a planning aid rather than a promise; the same calculator is useful in reverse for seeing how a credit card balance compounds against you. Nothing you enter is stored or sent to a server.",
      ],
      howTo: [
        "Enter the Initial deposit, the amount you are investing today (0 if starting from scratch).",
        "Enter the Monthly contribution you plan to add at the end of each month.",
        "Set the Annual interest rate as a percentage and the number of Years (1 to 60).",
        "Choose the Compounding frequency your account uses, Daily, Monthly, Quarterly or Annually, and pick a Currency for display.",
        "Read the Final balance, Total contributions, Interest earned and Effective annual rate tiles, plus the contributions versus interest bar.",
        "Click Show all years under Year-by-year growth to expand the table beyond the first ten years.",
      ],
      features: [
        "Initial deposit plus regular monthly contributions",
        "Daily, monthly, quarterly or annual compounding",
        "Final balance, total contributions and interest earned",
        "Effective annual rate (APY) for the chosen frequency",
        "Year-by-year table with running totals",
        "Visual split of contributions versus interest",
        "Any currency, runs entirely in your browser",
      ],
      faq: [
        {
          question: "What is the compound interest formula?",
          answer:
            "For a lump sum, A = P(1 + r/n)^(nt), where P is the principal, r the annual rate as a decimal, n the number of compounding periods per year and t the number of years. Because contributions arrive monthly, the tool converts the rate to an equivalent monthly rate, (1 + r/n)^(n/12) - 1, and steps through the schedule month by month, crediting interest and then adding the contribution.",
        },
        {
          question: "How much does compounding frequency matter?",
          answer:
            "Less than most people expect. At 6% a year, annual compounding yields exactly 6.00%, monthly compounding 6.17% and daily compounding 6.18%. The gap grows with higher rates and longer horizons, but the rate itself and the time invested dominate the outcome. The Effective annual rate tile shows the exact figure for the frequency you selected.",
        },
        {
          question: "What is the rule of 72?",
          answer:
            "A quick mental estimate of doubling time: divide 72 by the annual rate in percent. At 6% money doubles roughly every 12 years, at 8% every 9 years, at 12% every 6 years. It is an approximation that works best for rates between about 4% and 12% with no contributions; the year-by-year table gives the exact point at which your balance doubles.",
        },
        {
          question: "What is the difference between APR and APY?",
          answer:
            "APR is the nominal annual rate before compounding; APY, or effective annual rate, is what you actually earn in a year once compounding is included. A 6% APR compounded monthly is a 6.17% APY. Banks advertise APY on savings products because it is higher. Enter the nominal rate here and the Effective annual rate tile reports the APY for your compounding choice.",
        },
        {
          question: "Does the calculator account for inflation or taxes?",
          answer:
            "No. Results are nominal, before tax and fees. To estimate real purchasing power, subtract expected inflation from the rate, for example enter 4% instead of 7% if you assume 3% inflation. Tax treatment depends on the account type and your country, so apply your own rate to the Interest earned figure if the account is taxable.",
        },
        {
          question: "Are contributions added at the start or end of each month?",
          answer:
            "At the end of each month, after that month's interest has been credited. This is the common convention for savings calculators and is slightly more conservative than contributing at the start; over a long horizon the difference is roughly one month of growth on the contributions, about half a percent of the final balance in the twenty-year example above.",
        },
        {
          question: "Why does my result differ from my bank's projection?",
          answer:
            "Banks may compound daily but credit monthly, count days on a 365 or 360-day basis, charge fees, or change the rate over time. Contributions made at the start of the month also grow slightly more. Match the Compounding setting to your account's terms and expect small differences; a large gap usually points to fees or a variable rate.",
        },
      ],
    },
  },
};
