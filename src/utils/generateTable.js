const { AsciiTable3, AlignmentEnum } = require('ascii-table3')

/**
 * Generate an ASCII table from the given rows and title
 * @param {*} columns
 * @param {*} rows
 * @param {*} title
 * @returns
 */
module.exports.generateTable = async (columns, rows, title) => {
  const table = new AsciiTable3(title)

  table.setHeading(...columns).addRowMatrix(rows)

  return table.toString()
}
