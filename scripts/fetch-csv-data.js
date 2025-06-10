// Fetch and analyze the CSV data structure
async function fetchCSVData() {
  try {
    console.log("Fetching CSV data from the provided URL...")
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/student_info-Oo9xIxxKUEWLsxpw27UlBW2dD40FSn.csv",
    )
    const csvText = await response.text()

    console.log("CSV fetched successfully. First 500 characters:")
    console.log(csvText.substring(0, 500))

    // Parse CSV manually to understand structure
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    console.log("\nHeaders found:")
    console.log(headers)

    console.log("\nFirst few data rows:")
    for (let i = 1; i <= 5 && i < lines.length; i++) {
      const row = lines[i].split(",")
      console.log(`Row ${i}:`, row)
    }

    console.log(`\nTotal rows: ${lines.length - 1}`)

    // Sample a few rows to understand data types
    console.log("\nSample data analysis:")
    const sampleRow = lines[1].split(",")
    headers.forEach((header, index) => {
      console.log(`${header}: "${sampleRow[index]}" (type: ${typeof sampleRow[index]})`)
    })
  } catch (error) {
    console.error("Error fetching CSV:", error)
  }
}

fetchCSVData()
