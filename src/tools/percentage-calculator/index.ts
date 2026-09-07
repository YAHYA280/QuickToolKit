import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const percentageCalculator: ToolDefinition = {
  slug: "percentage-calculator",
  category: "finance",
  name: "Percentage Calculator",
  shortDescription: "Percentage calculator for percent of, percent change, tax, tips and discounts.",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "percentage of a number",
    "what percent is x of y",
    "percentage change calculator",
    "percent increase calculator",
    "percent decrease calculator",
    "percentage difference",
    "discount calculator",
    "tip calculator",
    "sales tax calculator",
    "reverse percentage",
    "percent off calculator",
    "how to calculate percentage",
  ],
  related: ["compound-interest-calculator", "loan-calculator", "unit-converter"],
  icon: "%",
  popular: true,
  component: Tool,
  content: {
    en: {
      title: "Percentage Calculator: Percent Change & Percent Of",
      description:
        "Free percentage calculator: find X% of a number, what percent X is of Y, percentage change, or add and subtract a percent for tax, tips and discounts.",
      intro: [
        "This percentage calculator answers the four questions people ask most often: what is X percent of a number, what percent one number is of another, the percentage change between an old and a new value, and what a number becomes after adding or subtracting a percentage. Each of the four calculators sits on the same page and updates as you type, so you can work out a 15% tip, a 20% discount, VAT on an invoice or the growth of a monthly metric without rearranging a formula. It suits shoppers, students and analysts alike. Everything is computed client-side in your browser, and no figures are uploaded or stored.",
        "Results show up to four decimal places with trailing zeros removed, the words increase or decrease make the direction of a change unambiguous, and dividing by zero shows a dash with a short note. The inputs accept decimals, so the same boxes handle 7.25% sales tax.",
        "Compared with a phone calculator, you never have to remember whether to divide by the old or the new value, and there is nothing to set up. The FAQ below covers reverse percentages and percentage points.",
      ],
      howTo: [
        "Pick the calculator that matches your question; all four update as you type.",
        "In What is X% of Y?, enter X (percent) and Y (number). For example 20 and 150 gives 30.",
        "In X is what percent of Y?, enter X (part) and Y (whole); 30 and 150 gives 20%.",
        "In Percentage change from X to Y, enter X (old value) and Y (new value); the sign shows the direction.",
        "In Add or subtract a percentage, enter Y (number), choose plus or minus, and enter X (percent); the note shows the amount.",
        "If you see a dash, check that both fields are filled and that you are not dividing by zero.",
      ],
      features: [
        "Four calculators on one page, updating live as you type",
        "Percent of, part of whole, percent change, and add or subtract",
        "Clear increase or decrease label on percentage change",
        "Shows the amount added or subtracted",
        "Division by zero handled gracefully with a dash and a note",
        "Up to four decimal places with trailing zeros trimmed",
        "Nothing is sent to a server",
      ],
      faq: [
        {
          question: "How do I calculate a percentage of a number?",
          answer:
            "Multiply the number by the percentage and divide by 100. For 20% of 150, compute 150 x 20 / 100 = 30. The reverse question, what percent one number is of another, divides the part by the whole and multiplies by 100, so 30 is 30 / 150 x 100 = 20% of 150.",
        },
        {
          question: "What is the difference between percent and percentage points?",
          answer:
            "Percent expresses a relative change; percentage points express an absolute difference between two percentages. If an interest rate rises from 4% to 5%, it has increased by one percentage point but by 25 percent, because 1 is a quarter of 4. Mixing the two is a common mistake in news reports, so state which one you mean.",
        },
        {
          question: "How do I reverse a percentage, for example find the price before tax?",
          answer:
            "Divide the final amount by (1 + rate). If a bill of 120 includes 20% VAT, the pre-tax price is 120 / 1.20 = 100, not 120 minus 20%, which gives 96. Subtracting undercounts because the 20% was applied to the smaller original price. For a discount, divide the sale price by (1 - rate) to recover the original.",
        },
        {
          question: "How is percentage change calculated?",
          answer:
            "Percentage change = (new - old) / old x 100. Going from 80 to 100 is a 25% increase; going from 100 to 80 is a 20% decrease. The two are not symmetric because the denominator is always the starting value, which is why a 50% loss needs a 100% gain to recover. The third calculator applies this formula and labels the direction.",
        },
        {
          question: "Is percentage change the same as percentage difference?",
          answer:
            "No. Percentage change measures movement from an old value to a new one and depends on direction. Percentage difference compares two values with no before and after, dividing the gap by their average: |a - b| / ((a + b) / 2) x 100, so 80 and 100 differ by 22.2% either way. Use change for growth over time and difference for two independent figures.",
        },
        {
          question: "Why do I see a dash instead of a result?",
          answer:
            "A dash appears when a field is empty or when the calculation would divide by zero, for example asking what percent a number is of zero, or measuring the change from a starting value of zero. A note under the result explains which case applies. Fill in both fields, and if the old value is genuinely zero, describe the change in absolute terms.",
        },
        {
          question: "How do I calculate a tip or a discount quickly?",
          answer:
            "Use the Add or subtract a percentage calculator: enter the bill, choose plus and type 15 or 18 for a tip, or choose minus and type the discount for a sale price; the note shows the amount itself. For mental arithmetic, find 10% by moving the decimal point one place left, then halve it for 5% or double it for 20%.",
        },
      ],
    },
  },
};
