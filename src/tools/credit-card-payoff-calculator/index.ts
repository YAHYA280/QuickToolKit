import type { ToolDefinition } from "../types";

export const creditCardPayoffCalculator: ToolDefinition = {
  slug: "credit-card-payoff-calculator",
  category: "finance",
  name: "Credit Card Payoff Calculator",
  shortDescription: "Credit card payoff calculator: months to debt free, interest and payment needed.",
  keywords: [
    "credit card payoff calculator",
    "credit card interest calculator",
    "credit card calculator",
    "pay off credit card calculator",
    "credit card payment calculator",
    "how long to pay off credit card",
    "credit card minimum payment calculator",
    "debt payoff calculator",
    "credit card apr calculator",
    "credit card debt calculator",
    "monthly payment to pay off credit card",
    "credit card interest per month",
  ],
  related: ["loan-calculator", "percentage-calculator", "emi-calculator"],
  icon: "cc",
  popular: false,
  content: {
    en: {
      title: "Credit Card Payoff Calculator: Months & Interest",
      description:
        "Credit card payoff calculator: how many months to clear a balance at your APR, the total interest you will pay and the monthly payment to be debt free.",
      intro: [
        "This credit card payoff calculator shows how long it takes to clear a card balance at a given APR, how much interest you will pay along the way, and what monthly payment gets you debt free by a target date. Enter the balance and APR, then either fix a monthly payment or ask for the amount needed to pay off the card in a set number of months. A comparison table sets your plan against a minimum-style payment and against paying 50 more each month. Everything runs in your browser, nothing is sent anywhere, and the result is an estimate, not financial advice.",
        "Interest is compounded monthly at APR divided by 12, the same simplification most issuer calculators use, and the final payment is only whatever is left, so the total paid is never overstated. If a payment does not even cover one month of interest the tool says so instead of showing a payoff date that never arrives.",
      ],
      howTo: [
        "Type the current Card balance and the APR from your statement.",
        "Choose Fixed monthly payment and enter what you can afford each month.",
        "Or choose Pay off in N months and enter the deadline to get the required monthly payment.",
        "Read the Months to payoff or Required monthly payment tile, plus Total interest, Total paid and Payoff date.",
        "Use the Compare payments table to see how a minimum-style payment and your payment plus 50 change the outcome.",
        "Pick a Currency for display; the calculation is identical in every currency.",
      ],
      features: [
        "Months to payoff and payoff date for any fixed monthly payment",
        "Required monthly payment to be debt free in a chosen number of months",
        "Total interest and total paid, with the last payment trimmed to the remaining balance",
        "Warning when a payment never clears the balance",
        "Comparison table: minimum-style payment, your payment and your payment plus 50",
        "Monthly compounding at APR / 12, matching issuer statements",
        "USD, EUR, GBP, CAD, AUD, INR and MAD formatting",
      ],
      faq: [
        {
          question: "How does the credit card payoff calculator work?",
          answer:
            "Each month it adds interest at APR divided by 12 to the balance, subtracts your payment and repeats until the balance is zero. For a 5,000 balance at 22.99% APR with a 200 payment, the monthly rate is 1.9158%, the balance clears in 35 months and total interest is about 1,871, so you pay roughly 6,871 in all. The last payment is smaller than 200 because only the remainder is due.",
        },
        {
          question: "How is credit card interest calculated each month?",
          answer:
            "Divide the APR by 12 and multiply by the balance. At 22.99% on 5,000 that is 0.019158 x 5,000, about 95.79 for the month. Issuers actually apply a daily periodic rate to the average daily balance, which gives a very similar figure, around 95.35 for a 30-day cycle. The hint under the APR field shows this monthly interest so you can see the floor your payment must beat.",
        },
        {
          question: "What happens if I only pay the minimum?",
          answer:
            "The minimum-style row in the comparison table uses 2% of the balance, with a floor of 25. On 5,000 at 22.99% that is 100 a month, which takes 167 months, nearly 14 years, and costs about 11,694 in interest, more than double the original balance. Real minimums shrink with the balance, so the true time is even longer.",
        },
        {
          question: "How much do I need to pay to clear the card in 12 or 24 months?",
          answer:
            "Switch to Pay off in N months. The required payment is B r (1 + r)^n / ((1 + r)^n - 1), the same formula as a loan instalment. For 5,000 at 22.99%, 24 months needs 261.84 a month and costs 1,284 in interest; 12 months needs 470.36 a month and costs about 644. Halving the time roughly halves the interest.",
        },
        {
          question: "Why does it say my payment never clears the balance?",
          answer:
            "Because the payment is no larger than the interest added each month, so the balance never falls. On 5,000 at 24.99% the monthly interest is 104.13; a 100 payment leaves the balance growing every month. The error shows the interest figure, so pay comfortably more than that. If the number is close, a small increase makes a large difference to the payoff time.",
        },
        {
          question: "How much does paying 50 more per month save?",
          answer:
            "Usually more than people expect, because every extra unit reduces the balance that interest is charged on. For 5,000 at 22.99%, 200 a month takes 35 months and 1,871 in interest; 250 a month takes 26 months and about 1,366, so the extra 50 saves nine months and roughly 505. The Your payment + 50 row in the table shows this for your own numbers.",
        },
        {
          question: "Should I do a balance transfer or pay the card off directly?",
          answer:
            "A 0% balance transfer can stop interest for 12 to 21 months, but most charge a 3% to 5% fee and the rate jumps afterwards. Compare the fee with the Total interest tile for the same payoff period; if the interest here is much larger, the transfer probably wins. Either way, paying more than the minimum matters most. This tool is an estimate, not personal financial advice.",
        },
      ],
    },
  },
};
