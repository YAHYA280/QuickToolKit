import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const loanCalculator: ToolDefinition = {
  slug: "loan-calculator",
  category: "finance",
  name: "Loan Calculator",
  shortDescription: "Loan calculator for monthly payment, total interest and amortization schedule.",
  keywords: [
    "loan calculator",
    "monthly payment calculator",
    "amortization calculator",
    "amortization schedule",
    "car loan calculator",
    "personal loan calculator",
    "mortgage calculator",
    "emi calculator",
    "loan interest calculator",
    "total interest on loan",
    "loan payoff calculator",
    "simple loan calculator",
    "auto loan payment",
    "loan repayment calculator",
  ],
  related: ["compound-interest-calculator", "percentage-calculator"],
  icon: "$",
  popular: true,
  component: Tool,
  content: {
    en: {
      title: "Loan Calculator: Monthly Payment & Amortization",
      description:
        "Free loan calculator: monthly payment (EMI), total interest and an amortization schedule for car, personal and home loans in any currency. In your browser.",
      intro: [
        "This loan calculator works out the fixed monthly payment on a loan from three numbers: the amount borrowed, the annual interest rate and the term. It also reports the total interest you will pay over the life of the loan, the total amount repaid, and a month-by-month amortization schedule showing how each payment splits between principal and interest and how the balance falls to zero. It applies the standard amortizing formula that banks use for car loans, personal loans and fixed-rate mortgages, so it suits anyone comparing offers or budgeting for a purchase. Calculations run client-side in your browser and nothing you enter is stored or sent to a server.",
        "Use it to see what a 25,000 car loan at 6.5% over five years really costs, about 489 a month and roughly 4,350 in interest, to compare a 36-month term against a 60-month one, or to check how much an extra half a percentage point adds over the term. A bar under the results shows what share of every unit repaid goes to interest rather than principal.",
        "Compared with a lender's own calculator, this one is neutral: no lead form, no rate lookup, and the same maths whichever currency you pick. It does not add taxes, insurance or fees, so treat the result as the principal-and-interest part of a full budget.",
      ],
      howTo: [
        "Type the amount you are borrowing in Loan amount.",
        "Enter the annual interest rate in Rate (annual), for example 6.5 for 6.5%.",
        "Set the Term (years) and, if the term is not a whole number of years, add the remainder in Extra months (0 to 11).",
        "Pick a Currency for display; the maths is identical for every currency.",
        "Read the Monthly payment, Total interest, Total paid and Payments tiles, plus the principal versus interest bar.",
        "Click Show all months under Amortization schedule to expand the table from the first year to the whole term.",
      ],
      features: [
        "Fixed monthly payment using the standard amortization formula",
        "Total interest, total paid and number of payments",
        "Full amortization schedule with principal, interest and remaining balance",
        "Term in years plus extra months for odd-length loans",
        "Principal versus interest share bar",
        "Any currency, including USD, EUR, GBP, CAD, AUD, INR and MAD",
        "Handles zero-interest loans; nothing sent to a server",
      ],
      faq: [
        {
          question: "What formula does the loan calculator use?",
          answer:
            "Monthly payment M = P * r * (1 + r)^n / ((1 + r)^n - 1), where P is the principal, r is the monthly interest rate (annual rate divided by 12 and by 100) and n is the number of monthly payments. This is the standard formula for fully amortizing fixed-rate loans. When the rate is zero the payment is simply P divided by n.",
        },
        {
          question: "What is an amortization schedule?",
          answer:
            "A table listing every payment over the loan term. Each row shows how much of that month's payment is interest, calculated on the remaining balance, how much reduces the principal, and the balance left afterwards. Early payments are mostly interest because the balance is high; later payments are mostly principal. The schedule shows exactly how the balance falls to zero on the last payment.",
        },
        {
          question: "Does this loan calculator work for mortgages?",
          answer:
            "Yes for fixed-rate mortgages: enter the amount, rate and a 15, 25 or 30-year term. It does not include property taxes, homeowners insurance, HOA fees or private mortgage insurance, which lenders often bundle into the monthly amount, and it does not model adjustable rates. Add those items separately for a full housing budget.",
        },
        {
          question: "Why does a longer term cost more in total?",
          answer:
            "A longer term lowers the monthly payment but interest accrues for more months on a higher average balance. On 25,000 at 6.5%, three years costs about 2,580 in interest, five years about 4,350 and seven years about 6,200. Compare the Total interest tile for each term to see the trade-off between a comfortable payment and the overall cost.",
        },
        {
          question: "Is APR the same as the interest rate?",
          answer:
            "Not exactly. The interest rate is what the lender charges on the balance; APR, the annual percentage rate, adds certain fees such as origination charges and expresses the total cost as a yearly rate. APR is therefore usually a little higher than the rate. If a lender quotes only an APR, entering it here gives a slightly conservative estimate of the payment.",
        },
        {
          question: "How do I calculate EMI, and is it the same as the monthly payment?",
          answer:
            "EMI, the equated monthly instalment used in India and elsewhere, is the same fixed monthly payment this calculator produces, computed with the same amortization formula. Enter the loan amount, annual rate and tenure in years, choose INR or any other currency, and the Monthly payment tile is your EMI. The schedule shows the principal and interest components of each instalment.",
        },
        {
          question: "Why is my payment different from the lender's quote?",
          answer:
            "Common reasons: the lender quoted an APR that includes fees, added insurance or taxes to the payment, uses daily interest or a 360-day year, or rounds differently. Small gaps of a few units are rounding; large gaps usually mean fees or escrow. Ask for the principal-and-interest figure alone and compare that.",
        },
      ],
    },
  },
};
