import type { ToolDefinition } from "../types";

export const emiCalculator: ToolDefinition = {
  slug: "emi-calculator",
  category: "finance",
  name: "EMI Calculator",
  shortDescription: "EMI calculator for home, car and personal loans with a monthly schedule.",
  keywords: [
    "emi calculator",
    "home loan emi calculator",
    "car loan emi calculator",
    "personal loan emi calculator",
    "emi calculator online",
    "loan emi calculator",
    "emi formula",
    "emi calculation formula",
    "monthly emi calculator",
    "home loan calculator india",
    "reducing balance emi",
    "emi schedule",
    "education loan emi calculator",
    "bike loan emi calculator",
  ],
  related: ["loan-calculator", "mortgage-calculator", "compound-interest-calculator"],
  icon: "emi",
  popular: true,
  content: {
    en: {
      title: "EMI Calculator: Home, Car & Personal Loan EMI",
      description:
        "EMI calculator for home, car and personal loans: monthly EMI, total interest, interest share and a month-wise schedule using the reducing balance formula.",
      intro: [
        "This EMI calculator works out the equated monthly instalment on a home, car, personal or education loan from the loan amount, annual interest rate and tenure. It uses the reducing balance formula every bank and NBFC applies, so the EMI matches your sanction letter for the same inputs. Alongside the EMI you get total interest, the total amount repaid, interest as a share of every rupee paid and a year-by-year schedule with month names, plus an optional processing fee in the total cost. It runs entirely in your browser, and the figures are an estimate for planning, not financial advice.",
        "Defaults are set for a typical Indian home loan, 10,00,000 at 8.5% for 20 years in INR, which gives an EMI of 8,678. Change the currency to USD, EUR, GBP, CAD, AUD or MAD and the formula stays the same; only the number formatting changes.",
        "Compare 15 and 20 year terms on the Total interest tile, or pick the first EMI month so the schedule shows calendar dates that match your bank statement.",
      ],
      howTo: [
        "Enter the Loan amount you plan to borrow; the default is 10,00,000.",
        "Type the annual Interest rate quoted by the bank, for example 8.5.",
        "Set the Loan tenure and use the Years / Months toggle to enter it the way your lender expresses it.",
        "Optionally add the Processing fee percentage to see the total cost including the one-time charge.",
        "Pick the First EMI month and a Currency so the schedule shows the right dates and formatting.",
        "Read the Monthly EMI tile, the principal versus interest bar and the yearly schedule; click Show monthly to see the first 12 instalments.",
      ],
      features: [
        "EMI using the reducing balance formula banks apply",
        "Total interest, total payment and interest as a percentage of the total",
        "Tenure in years or months with one-click conversion",
        "Processing fee added to the total cost without changing the EMI",
        "Yearly repayment schedule with calendar months, plus a monthly view",
        "Principal versus interest bar",
        "INR by default with lakh grouping; USD, EUR, GBP, CAD, AUD and MAD too",
      ],
      faq: [
        {
          question: "What is the EMI formula and how is it calculated?",
          answer:
            "EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the principal, r the monthly rate (annual rate divided by 12 and by 100) and n the tenure in months. For 10,00,000 at 8.5% over 20 years, r is 0.0070833 and n is 240, which gives an EMI of 8,678.23. Over the tenure you pay 20,82,776 in total, of which 10,82,776 is interest.",
        },
        {
          question: "What is the difference between reducing balance and flat rate EMI?",
          answer:
            "With a reducing balance loan, interest is charged each month only on the outstanding principal, so the interest part of every EMI shrinks over time. A flat rate charges interest on the full original amount for the whole tenure. At 8.5% flat on 10,00,000 for 20 years the interest is 17,00,000 and the EMI 11,250, equivalent to roughly 12.3% reducing. This calculator uses the reducing balance method.",
        },
        {
          question: "Why does total interest change so much with tenure?",
          answer:
            "A longer tenure lowers the EMI but keeps the balance outstanding for more months, so interest accrues for longer. For 10,00,000 at 8.5%: a 10-year loan has an EMI of 12,399 and total interest of about 4,87,828; 20 years gives 8,678 and 10,82,776; 30 years gives 7,689 but 17,68,089 in interest. Pick the shortest tenure whose EMI fits comfortably in your monthly budget.",
        },
        {
          question: "How does prepayment affect my EMI and interest?",
          answer:
            "A prepayment reduces the outstanding principal, so less interest accrues from the next month. Most lenders let you either keep the EMI and shorten the tenure, which saves the most, or keep the tenure and lower the EMI. Paying 5,000 extra every month on the 10,00,000 example clears the loan in 104 months instead of 240 and cuts interest from 10,82,776 to about 4,13,709. Check for prepayment penalties on fixed-rate loans.",
        },
        {
          question: "Does the processing fee change the EMI?",
          answer:
            "No. A processing fee is a one-time charge, usually 0.5% to 2% of the loan amount, paid at sanction or deducted from the disbursed amount. It does not enter the EMI formula, so the calculator adds it to the total cost instead. On 10,00,000 a 1% fee is 10,000, taking the total cost of the 20-year example from 20,82,776 to 20,92,776.",
        },
        {
          question: "How much does the interest rate affect the EMI?",
          answer:
            "Each percentage point matters more on long tenures. On 10,00,000 over 20 years, 8% gives an EMI of 8,364, 8.5% gives 8,678 and 9% gives 8,997. The half-point difference between 8.5% and 9% is about 319 a month, or roughly 76,600 across 240 instalments. Use the Interest rate field to compare offers; a small rate cut can justify a balance transfer.",
        },
        {
          question: "Is the EMI fixed for the whole tenure?",
          answer:
            "On a fixed-rate loan, yes. Floating-rate home loans move with the lender benchmark, and when the rate rises most banks keep the EMI the same and extend the tenure rather than raising the instalment, which quietly adds interest. Recalculate here whenever your rate changes, using the outstanding balance as the loan amount and the remaining months as the tenure.",
        },
      ],
    },
  },
};
