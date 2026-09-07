import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const unitConverter: ToolDefinition = {
  slug: "unit-converter",
  category: "converters",
  name: "Unit Converter",
  shortDescription: "Unit converter for length, weight, temperature, area, volume, speed and data.",
  keywords: [
    "unit converter",
    "metric converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "celsius to fahrenheit",
    "kg to lbs",
    "cm to inches",
    "miles to km",
    "liters to gallons",
    "area converter",
    "speed converter",
    "kb to mb",
    "gb to gib",
  ],
  related: ["color-converter", "percentage-calculator", "loan-calculator"],
  icon: "cm",
  popular: true,
  component: Tool,
  content: {
    en: {
      title: "Unit Converter Online: Length, Weight, Temperature",
      description:
        "Free unit converter for length, weight, temperature, area, volume, speed and data. Exact factors, every unit in a table, instant results in your browser.",
      intro: [
        "This unit converter turns a value in one unit into any other unit of the same category as you type, and lists the same value in every unit of that category in a table underneath so you can compare metric and imperial or US customary at a glance. Seven categories are covered: length, weight, temperature, area, volume, speed and digital storage, with the everyday units people actually search for, from millimeters and miles to cups, gallons, knots and gibibytes. Cooks, students, travellers, engineers and anyone buying from a foreign store will find what they need. Conversion runs client-side in your browser with a small factor table and no network request.",
        "Conversions use exact international definitions where they exist, for example 1 inch = 25.4 mm, 1 pound = 0.45359237 kg and 1 US gallon = 3.785411784 liters, and temperature uses proper offset formulas rather than a plain multiplier. Results are rounded to six significant digits to hide floating-point noise, and a Conversion factor tile shows what one unit of the source equals so you can reuse the ratio in a spreadsheet.",
        "It is faster than a search engine card when you have a list of values to run through, and unlike a phone app it needs no install. Swap the direction with one click to check a result in reverse.",
      ],
      howTo: [
        "Choose a Category such as Length, Weight or Temperature.",
        "Enter the number to convert in the Value field.",
        "Pick the source unit in From and the target unit in To.",
        "Read the Result tile and the Conversion factor tile, which shows what 1 source unit equals in the target unit.",
        "Click the Swap units arrow between the dropdowns to reverse the direction.",
        "Scroll to the All units table to see the same value in every unit of the category; the row for your target unit is highlighted.",
      ],
      features: [
        "Seven categories: length, weight, temperature, area, volume, speed and data",
        "Nearly 50 units including metric, US customary and imperial",
        "Exact conversion factors based on international definitions",
        "Correct offset formulas for Celsius, Fahrenheit and Kelvin",
        "Decimal (KB, MB, GB) and binary (KiB, MiB, GiB) data units",
        "All-units table and a conversion factor for reuse in spreadsheets",
        "Instant results with no server round trip",
      ],
      faq: [
        {
          question: "Are the gallons and cups US or imperial?",
          answer:
            "US customary. A US gallon is 3.785411784 liters while an imperial (UK) gallon is 4.54609 liters, about 20% larger, and the same difference applies to quarts, pints and fluid ounces. The cup used here is the US customary cup of 236.588 ml; US nutrition labels round it to 240 ml and many metric recipes use a 250 ml cup.",
        },
        {
          question: "What is the difference between KB and KiB?",
          answer:
            "KB (kilobyte) follows the decimal SI prefix and equals 1,000 bytes, which is how storage manufacturers and network speeds are quoted. KiB (kibibyte) is the binary unit of 1,024 bytes used by operating systems and memory sizes. The gap grows with each step: a gigabyte is 1,000,000,000 bytes while a gibibyte is 1,073,741,824 bytes, which is why a 1 TB drive shows up as about 931 GiB.",
        },
        {
          question: "How do I convert Celsius to Fahrenheit?",
          answer:
            "Multiply by 9/5 and add 32: 20 C is 20 x 1.8 + 32 = 68 F. To go the other way, subtract 32 and multiply by 5/9. Kelvin is Celsius plus 273.15. Temperature scales have different zero points, so they cannot be converted with a single multiplier, which is why the tool converts every input to Celsius first. Absolute zero is 0 K, which is -273.15 C or -459.67 F.",
        },
        {
          question: "Why are results shown with six significant digits?",
          answer:
            "Binary floating-point cannot represent most decimal fractions exactly, so a naive conversion might print 100.00000000000001 instead of 100. Rounding to six significant digits removes that noise while keeping more precision than almost any practical measurement requires. Very large or very small results switch to exponent notation, such as 1e-7, to stay readable.",
        },
        {
          question: "Is a ton the same everywhere?",
          answer:
            "No. This tool uses the metric tonne of exactly 1,000 kg. The US short ton is 2,000 lb (907.185 kg) and the UK long ton is 2,240 lb (1,016.05 kg). If a document just says ton, check which one is meant before relying on the number; shipping and mining figures in particular mix all three.",
        },
        {
          question: "How many centimeters are in an inch, and kilometers in a mile?",
          answer:
            "One inch is exactly 2.54 cm, so 1 cm is about 0.3937 inches. One mile is exactly 1.609344 km, so 1 km is about 0.6214 miles. For weight, 1 kg is about 2.2046 lb and 1 lb is exactly 0.45359237 kg. These are the international yard and pound definitions adopted in 1959, and they are the factors the converter uses.",
        },
        {
          question: "Why does my result differ from another converter?",
          answer:
            "The usual causes are rounded factors, for example 0.4536 instead of 0.45359237 for a pound, or a different unit with the same name: imperial versus US gallons, short versus metric tons, or decimal KB versus binary KiB. Compare the Conversion factor tile with the other tool's stated factor to find the mismatch, and check the unit names in the From and To dropdowns.",
        },
      ],
    },
  },
};
