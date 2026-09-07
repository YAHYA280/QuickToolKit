import type { ToolDefinition } from "../types";

export const discountCalculator: ToolDefinition = {
  slug: "discount-calculator",
  category: "finance",
  name: "Discount Calculator",
  shortDescription: "Discount calculator for percent off, stacked deals, buy X get Y and sales tax.",
  keywords: [
    "discount calculator",
    "percent off calculator",
    "sale price calculator",
    "discount calculator with tax",
    "double discount calculator",
    "stacked discount calculator",
    "buy one get one free calculator",
    "how to calculate discount",
    "20 percent off calculator",
    "reverse discount calculator",
    "original price calculator",
    "price after discount",
    "percentage off",
  ],
  related: ["percentage-calculator", "tip-calculator", "loan-calculator"],
  icon: "-%",
  content: {
    en: {
      title: "Discount Calculator: Percent Off and Sale Price",
      description:
        "Discount calculator for percent off, fixed amount off, stacked discounts, buy X get Y deals and reverse lookups, with sales tax added on the sale price.",
      intro: [
        "This discount calculator shows the sale price, how much you save and the effective percentage off for any deal. Four modes cover Percent off with an optional stacked second discount and sales tax, Fixed amount off for coupons, Buy X get Y for multi-buy offers, and Find the discount, which works backwards from the original and final price to give the percentage. A reference table lists the same item at 5 to 50 percent off. It runs in your browser with nothing uploaded, so you can check a price in the store before you reach the till.",
        "Stacked discounts are where most people go wrong. A 20 percent discount followed by an extra 10 percent is not 30 percent off, because the second discount applies to the already reduced price; the true saving is 28 percent. The calculator multiplies the factors correctly and adds sales tax to the discounted price, as stores do.",
        "Use Find the discount to check whether a sale sticker is honest, Buy X get Y to compare a three-for-two offer with a straight markdown, and the FAQ for the formulas, including how to reverse a discount.",
      ],
      howTo: [
        "Choose a mode: Percent off, Fixed amount off, Buy X get Y or Find the discount.",
        "Enter the Original price and select your Currency.",
        "In Percent off, type the Discount, add an optional Second discount if the offer stacks, and a Sales tax rate if tax applies.",
        "In Fixed amount off, enter the Amount off; in Buy X get Y, enter the Buy quantity and Free quantity.",
        "In Find the discount, enter the Final price you were charged to reveal the percentage off.",
        "Read the Final price, You save, Effective discount and Tax added stats, then scan the quick reference table.",
      ],
      features: [
        "Four modes: percent off, fixed amount off, buy X get Y and find the discount",
        "Stacked second discount calculated correctly by multiplying, not adding",
        "Optional sales tax applied to the discounted price",
        "Buy X get Y converted into an effective percentage off",
        "Reverse mode finds the percentage from original and final prices",
        "Quick table of the price at 5 to 50 percent off",
        "Seven currencies with locale-aware formatting",
        "Runs in your browser with nothing stored",
      ],
      faq: [
        {
          question: "How do I calculate a percentage discount?",
          answer:
            "Multiply the original price by the discount percentage and divide by 100 to get the saving, then subtract it from the price. A 25 percent discount on 80.00 saves 80 x 25 / 100 = 20.00, so the sale price is 60.00. Equivalently, multiply the price by 1 minus the rate: 80 x 0.75 = 60. The Percent off mode shows both the saving and the final price.",
        },
        {
          question: "Why is 20 percent off plus 10 percent off not 30 percent off?",
          answer:
            "Because the second discount is taken from the already reduced price, not the original. On 100, 20 percent off leaves 80, and 10 percent off that leaves 72, so the total saving is 28 percent. The rule multiplies the remaining fractions: 0.8 x 0.9 = 0.72. Stacked discounts always save less than the sum of the percentages, and the gap grows as they get larger.",
        },
        {
          question: "Is sales tax charged on the discounted price or the original?",
          answer:
            "In almost every jurisdiction, sales tax or VAT is charged on the amount you actually pay, which is the discounted price. A 50.00 item at 20 percent off is 40.00, and 8 percent tax on that adds 3.20 for a total of 43.20, not 44.00. Manufacturer coupons are the main exception in some US states, where tax may be calculated before the coupon is applied.",
        },
        {
          question: "How do I reverse a discount to find the original price?",
          answer:
            "Divide the sale price by 1 minus the discount rate. If a jacket costs 63.00 after 30 percent off, the original price was 63 / 0.70 = 90.00. Adding 30 percent back to 63 gives only 81.90, which is wrong because the 30 percent was taken from the larger original price. Find the discount does the related job of finding the rate from both prices.",
        },
        {
          question: "How do I find what percent off a sale price is?",
          answer:
            "Subtract the final price from the original, divide by the original and multiply by 100. If a 120.00 item is now 90.00, the discount is (120 - 90) / 120 x 100 = 25 percent. Choose Find the discount, enter both prices, and the percentage appears in the highlighted stat, which is handy for checking whether a sale label is accurate.",
        },
        {
          question: "How much is buy 2 get 1 free as a percentage?",
          answer:
            "Divide the free items by the total items you take home. Buy 2 get 1 free means 3 items for the price of 2, so the effective discount is 1 / 3 = 33.3 percent. Buy 1 get 1 free is 50 percent off and buy 3 get 1 free is 25 percent. The Buy X get Y mode shows the bundle price, the saving and the effective rate.",
        },
        {
          question: "Which is better, a fixed amount off or a percentage off?",
          answer:
            "It depends on the price. A 10.00 coupon beats 10 percent off on anything under 100.00 and loses above it, because the percentage grows with the price while the fixed amount stays the same. On a 60.00 item, 10.00 off leaves 50.00 while 10 percent off leaves 54.00. Try both Fixed amount off and Percent off to compare the final prices directly.",
        },
      ],
    },
  },
};
