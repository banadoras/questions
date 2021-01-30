const docx = require("docx")
const fs = require("fs")

function createQuestionDoc(question) {
    const doc = new docx.Document()
    doc.addSection({
        properties: {},
        children: [
             new docx.Paragraph({
                text: "Question",
                heading: docx.HeadingLevel.HEADING_3,
            }),
            new docx.Paragraph({
                text: question.stem,
            }),
            new docx.Paragraph({
                text: " ",
            }),
            new docx.Paragraph({
                text: "1. " + question.options[0],
            }),
            new docx.Paragraph({
                text: "2. " + question.options[1],
            }),
            new docx.Paragraph({
                text: "3. " + question.options[2],
            }),
            new docx.Paragraph({
                text: "4. " + question.options[3],
            }),
            new docx.Paragraph({
                text: " ",
            }),
            new docx.Paragraph({
                text: "Correct Answer",
                heading: docx.HeadingLevel.HEADING_3,
            }),
            new docx.Paragraph({
                text: question.correct.toString(),
            }),
            new docx.Paragraph({
                text: " ",
            }),
            new docx.Paragraph({
                text: "Explanation",
                heading: docx.HeadingLevel.HEADING_3,
            }),
            new docx.Paragraph({
                text: question.explanation,
            }),
        ],
    });

    // Used to export the file into a .docx file
    const docPath = "./public/files/question" + question.author + Date.now() + ".docx"

    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(docPath, buffer);
        

    });
return docPath
    
}

module.exports = createQuestionDoc