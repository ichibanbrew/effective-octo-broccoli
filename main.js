(() => {
    const parentDOM = document.getElementsByClassName("table1")[0];
    if (!parentDOM) {
        alert("Не найдена таблица с ответами");
        return;
    }
    const rows = parentDOM.querySelectorAll("table.table1 > tbody > tr");
    if (!rows.length) {
        alert("Не найдены ряды таблицы с ответами");
        return;
    }

    const bracketsMap = {
        "B": { openBracket: "[b]", closeBracket: "[/b]" },
        "I": { openBracket: "[i]", closeBracket: "[/i]" },
        "U": { openBracket: "[u]", closeBracket: "[/u]" },
    };

    const emoticonsMap = {
        "sm1.gif": " :) ",
        "sm6.gif": " :D ",
        "sm9.gif": " :? ",
        "sm15.gif": " :P ",
        "sm10.gif": " 8-) ",
        "sm16.gif": " :P ",
        "sm2.gif": " :( ",
        "sm4.gif": " :P ",
        "sm3.gif": " ;) ",
        "sm7.gif": " :shock: ",
    };

    const defaultEmoticon = " :) ";

    const parseText = (node) => {
        let parsed = "";
        while (node) {
            // console.log("        nodeName:" + node.nodeName + ", nodeValue: " + node.nodeValue + ", nodeType: " + node.nodeType);
            let innerParsed = "";
            if (node.hasChildNodes()) {
                innerParsed = parseText(node.firstChild);
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                switch (node.nodeName) {
                    case "B":
                    case "I":
                    case "U":
                        let brackets = bracketsMap[node.nodeName] ?? { openBracket: "", closeBracket: "" };
                        parsed += `${brackets.openBracket}${innerParsed}${brackets.closeBracket}`;
                        break;
                    case "BR":
                        parsed += "\n";
                        break;
                    case "A":
                        parsed += `[url=${node.href}]${innerParsed}[/url]`;
                        break;
                    case "IMG":
                        if (node.currentSrc.includes("img/sm/sm") && node.currentSrc.endsWith(".gif")) {
                            // Emoticon
                            let split = node.currentSrc.split("/");
                            let filename = split[split.length - 1];
                            let emoticon = emoticonsMap[filename] ?? defaultEmoticon;
                            // console.log("Image filename: " + filename + ", emoticon: " + emoticon);
                            parsed += emoticon;
                        }
                        break;
                    case "TABLE":
                        if (node.className === "view_quote") {
                            // Quotation
                            parsed += `[quote]${innerParsed}[/quote]`;
                        }
                        break;
                    case "TBODY":
                    case "TR":
                    case "TD":
                        // These above can only come from quotations, so return up the stack.
                    case "FONT":
                        parsed += innerParsed;
                        break;
                    default:
                        break;
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                parsed += node.nodeValue;
            }
            node = node.nextSibling;
        }
        return parsed;
    };

    let answers = [];
    // Skip the first row containing headings, so start with index of 1.
    for (let i = 1; i < rows.length; i++) {
        // Two <tr>s per answer.
        switch (i % 2) {
            case 0:
                // Answer
                const answer_cell = rows[i].getElementsByClassName("view_td3")[0];
                answers[answers.length - 1].answer = answer_cell;
                if (!answer_cell.hasChildNodes()) { alert("Answer cell is empty"); }
                // console.log(answer_cell.children);
                let parsed = parseText(answer_cell.firstChild);
                answers[answers.length - 1].answer = parsed;
                break;
            case 1:
                // Heading
                const author_cell = rows[i].getElementsByClassName("view_td1")[0];
                const timestamp_cell = rows[i].getElementsByClassName("view_td2")[0];
                answers.push({ author: author_cell.firstElementChild.textContent, timestamp: timestamp_cell.firstElementChild.textContent });
                break;

            default:
                break;
        }
    }

    let output = "";
    for (let i = 0; i < answers.length; i++) {
        output += `(Автор: [b]${answers[i].author}[/b])\n(${answers[i].timestamp})\n${answers[i].answer}\n\n`;
        output += "^^^^^^^^^^^^^^^^^^^^^^^^ КОНЕЦ ПОСТА ^^^^^^^^^^^^^^^^^^^^^^^^\n\n\n\n\n\n\n\n\n";
    }

    const outputToFile = (output) => {
        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(output));
        element.setAttribute("download", "форум.txt");

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    outputToFile(output);

})();
