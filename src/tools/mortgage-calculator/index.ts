import type { ToolDefinition } from "../types";

export const mortgageCalculator: ToolDefinition = {
  slug: "mortgage-calculator",
  category: "finance",
  name: "Mortgage Calculator",
  shortDescription: "Mortgage calculator with taxes, insurance, HOA, PMI and extra payments.",
  keywords: [
    "mortgage calculator",
    "mortgage payment calculator",
    "monthly mortgage payment",
    "mortgage calculator with pmi",
    "mortgage calculator with taxes and insurance",
    "home loan calculator",
    "mortgage amortization calculator",
    "extra payment mortgage calculator",
    "mortgage payoff calculator",
    "house payment calculator",
    "pmi calculator",
    "30 year mortgage calculator",
    "15 year mortgage calculator",
    "how much house can i afford",
  ],
  related: ["loan-calculator", "emi-calculator", "compound-interest-calculator"],
  icon: "$/mo",
  popular: true,
  content: {
    en: {
      title: "Mortgage Calculator: Payment with Taxes, PMI & HOA",
      description:
        "Free mortgage calculator with property tax, insurance, HOA and PMI. See your total monthly payment, payoff date with extra payments and a yearly schedule.",
      intro: [
        "This mortgage calculator estimates the full monthly cost of a home loan, not just principal and interest. Enter the home price, down payment, term and rate, then add property tax, homeowners insurance, HOA dues and, if you put down less than 20%, private mortgage insurance. You get the total monthly payment, a breakdown bar, the payoff date with any extra monthly payment and a year-by-year amortization table. Everything runs in your browser, nothing is uploaded, and the result is a planning estimate, not financial advice or a lender quote.",
        "Principal and interest use the standard amortization formula for fixed-rate mortgages, so the figure matches bank quotes for the same inputs. Taxes and insurance are entered per year and divided by twelve, HOA is monthly, and PMI is a yearly percentage of the loan, charged until the balance falls to 80% of the purchase price and then dropped from the schedule.",
        "Use it to compare 15 and 30-year terms, to see what a 5% down payment costs once PMI is added, or to test how 200 extra a month shortens the loan. The maths is identical in every currency.",
      ],
      howTo: [
        "Enter the Home price and Down payment, using the % / amount toggle beside the field.",
        "Choose a Loan term (30, 20, 15 or 10 years) and type the Interest rate your lender quoted.",
        "Add yearly Property tax and Home insurance, plus monthly HOA fees if any.",
        "Leave Add PMI checked and set the PMI rate (0.5% a year is typical) for a down payment under 20%.",
        "Type an Extra monthly payment to see the new payoff date and the interest saved.",
        "Read the Total monthly payment tile and the breakdown bar, then click Show monthly to see the first year of the table.",
      ],
      features: [
        "Total monthly payment including principal, interest, tax, insurance, HOA and PMI",
        "PMI calculated automatically and dropped once the balance reaches 80% of the price",
        "Down payment as a percentage or a fixed amount",
        "Extra monthly payment with new payoff date and interest saved",
        "Stacked breakdown bar with a legend for every cost component",
        "Year-by-year amortization table plus a monthly view of the first 12 payments",
        "Any currency: USD, EUR, GBP, CAD, AUD, INR and MAD",
      ],
      faq: [
        {
          question: "How is the monthly mortgage payment calculated?",
          answer:
            "Principal and interest use M = P r (1 + r)^n / ((1 + r)^n - 1): P is the loan amount, r the monthly rate (annual rate divided by 12 and by 100) and n the number of payments. A 400,000 home with 20% down means a 320,000 loan; at 6.5% over 30 years r is 0.005417, n is 360 and M is 2,022.62 a month, with 408,142 of interest over the term.",
        },
        {
          question: "What does the total monthly payment include?",
          answer:
            "It adds property tax and homeowners insurance, both entered per year and divided by 12, monthly HOA fees, and PMI if it applies, to principal and interest. With 4,800 tax and 1,500 insurance on the 320,000 example, that is 400 plus 125 on top of 2,022.62, so 2,547.62 in total. Lenders often collect the tax and insurance parts in an escrow account.",
        },
        {
          question: "What is PMI and when does it stop?",
          answer:
            "Private mortgage insurance protects the lender when you put down less than 20%. The calculator charges a yearly percentage of the original loan, 0.5% by default, until the balance falls to 80% of the price. With 10% down on a 400,000 home the loan is 360,000, so PMI is 150 a month; at 6.5% over 30 years it drops off around month 95, after roughly 14,250 in premiums.",
        },
        {
          question: "How much does an extra monthly payment save?",
          answer:
            "Every extra unit goes straight to principal, so less interest accrues later. On the 320,000 loan at 6.5%, 200 extra each month clears the balance in 281 months, about 23 years and 5 months instead of 30, and cuts total interest from 408,142 to about 302,714, saving roughly 105,400. Type the amount in Extra monthly payment to see your own figures.",
        },
        {
          question: "Should I pick a 15-year or a 30-year mortgage?",
          answer:
            "A shorter term means a higher payment but far less interest. The same 320,000 at 6.5% costs 2,787.54 a month over 15 years with 181,758 of interest, against 2,022.62 and 408,142 over 30 years. Pick the term in Loan term and compare the Total interest tile; choose what your monthly budget can absorb safely.",
        },
        {
          question: "How much down payment do I need to avoid PMI?",
          answer:
            "In most markets 20% of the purchase price avoids PMI, because the loan-to-value ratio starts at 80%. Many programs accept 3% to 10% down, but then PMI applies until you build 20% equity. Enter your figure in Down payment as a % or an amount; the hints show the resulting loan amount and the monthly cost of PMI on a smaller deposit.",
        },
        {
          question: "Why does my lender quote differ from this estimate?",
          answer:
            "Lenders quote an APR that folds in origination fees, use escrow estimates that change with tax reassessments, and may round differently. Adjustable-rate mortgages change after the fixed period, which this fixed-rate model does not track. Treat the result as a planning estimate, not advice or an offer, and compare the principal-and-interest line on the official loan estimate with the tile here.",
        },
      ],
    },
  },
};
