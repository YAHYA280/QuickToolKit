import type { ToolDefinition } from "../types";

export const tipCalculator: ToolDefinition = {
  slug: "tip-calculator",
  category: "finance",
  name: "Tip Calculator",
  shortDescription: "Tip calculator with bill splitting, quick percentages and rounding up the total.",
  keywords: [
    "tip calculator",
    "tip calculator split bill",
    "how much to tip",
    "gratuity calculator",
    "restaurant tip calculator",
    "20 percent tip calculator",
    "split the bill calculator",
    "tip per person",
    "tip on pre tax amount",
    "15 percent tip",
    "18 percent tip",
    "tipping calculator",
    "how to calculate tip",
  ],
  related: ["percentage-calculator", "discount-calculator", "salary-to-hourly-calculator"],
  icon: "tip",
  popular: true,
  content: {
    en: {
      title: "Tip Calculator: Split the Bill and Tip Percentage",
      description:
        "Tip calculator that works out the tip, total and per-person share for any bill, with quick 15, 18 and 20 percent buttons, pre-tax tipping and rounding up.",
      intro: [
        "This tip calculator works out the tip, the total and how much each person pays as soon as you enter the bill. Pick a percentage with the slider or the quick 10, 15, 18, 20 and 25 percent buttons, choose how many people are splitting, and the per-person share updates instantly. Two options cover the usual table debates: tip on the pre-tax amount, which backs sales tax out of the bill first, and round the total up to the next whole currency unit for easy cash payment. It runs in your browser and nothing you type is sent anywhere.",
        "A comparison table shows the tip, total and per-person amount at 15, 18, 20, 22 and 25 percent for the same bill, and seven currencies are formatted for your locale.",
        "Tipping customs vary, so the FAQ below summarises what is expected in the United States, the United Kingdom, Europe and Japan, and explains how to split a bill unevenly.",
      ],
      howTo: [
        "Enter the Bill amount and pick a Currency.",
        "Choose a tip percentage with the slider or press one of the quick buttons: 10, 15, 18, 20 or 25 percent.",
        "Set Split between to the number of people paying; it must be at least 1.",
        "Tick Tip on pre-tax amount and enter the Sales tax rate if you want the tip based on the bill before tax.",
        "Tick Round total up to whole currency unit to bump the total to the next whole amount; the tip adjusts to match.",
        "Read the Tip amount, Total and Per person stats, then compare other percentages in the table below them.",
      ],
      features: [
        "Slider from 0 to 30 percent plus quick buttons for 10, 15, 18, 20 and 25",
        "Split between any number of people with the per-person share highlighted",
        "Tip on the pre-tax amount by entering the sales tax rate",
        "Round the total up to a whole currency unit for easy cash payment",
        "Side-by-side table of 15, 18, 20, 22 and 25 percent for the same bill",
        "Seven currencies with locale-aware formatting",
        "Nothing leaves your browser",
      ],
      faq: [
        {
          question: "How do I calculate a tip?",
          answer:
            "Multiply the bill by the tip percentage and divide by 100. On a 64.00 bill, an 18 percent tip is 64 x 18 / 100 = 11.52, making the total 75.52. Split between two people that is 37.76 each. For quick mental math, find 10 percent by moving the decimal point one place left, then add half of that again for 15 percent or double it for 20 percent.",
        },
        {
          question: "How much should I tip in the United States?",
          answer:
            "In US restaurants with table service, 15 to 20 percent of the pre-tax bill is standard, and 20 percent is the norm in large cities. Bartenders usually get 1 to 2 per drink or 15 to 20 percent of the tab, and delivery and rideshare drivers 10 to 20 percent. Counter service tipping is optional, and some restaurants add an automatic gratuity for large groups.",
        },
        {
          question: "What are the tipping customs in other countries?",
          answer:
            "In the United Kingdom, 10 to 12.5 percent is usual in restaurants, and a service charge of that size is often already on the bill, in which case no extra tip is expected. Across much of Europe, rounding up or leaving 5 to 10 percent is polite but not required. In Japan and South Korea tipping is not customary. Canada follows the US norm of 15 to 20 percent.",
        },
        {
          question: "Should I tip on the pre-tax or post-tax amount?",
          answer:
            "Etiquette guides say the tip is traditionally based on the pre-tax subtotal, since tax is not part of the service, though many people tip on the total because it is easier. The difference is small: on a 100 subtotal with 8 percent tax and a 20 percent tip, tipping pre-tax gives 20.00 while tipping on the 108.00 total gives 21.60. Tick Tip on pre-tax amount to follow the traditional rule.",
        },
        {
          question: "How do I split a bill unevenly?",
          answer:
            "If one person ordered much more, tip on the whole bill first, then divide the tip in proportion to what each person spent. For a 120 bill where one guest had 80 and the other 40, an 18 percent tip is 21.60; the first guest pays 80 plus two thirds of the tip, 14.40, and the second pays 40 plus 7.20. Running each subtotal through the calculator separately gives the same result.",
        },
        {
          question: "What does Round total up do?",
          answer:
            "It raises the total to the next whole currency unit and adds the difference to the tip. If the bill is 47.30 and a 20 percent tip is 9.46, the exact total is 56.76; rounding up makes it 57.00 and the tip becomes 9.70. It is handy when paying cash, and because rounding is always upward the server never receives less than the chosen percentage.",
        },
        {
          question: "Is it rude to tip in Japan?",
          answer:
            "Tipping is not part of Japanese service culture, and staff may politely refuse or return the money. The same is broadly true in South Korea and in mainland China outside tourist hotels. Good service is considered standard and included in the price, and some upscale restaurants and ryokan add a service charge instead. A small gift or a sincere thank you is more appropriate than cash.",
        },
      ],
    },
  },
};
