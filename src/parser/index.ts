const DEFAULT_IMAGE = "/image-placeholder.jpg";

export class MarkdownParser {
	private static readonly HEADING_REGEX = /^(#{1,6})\s(.+)$/gm;
	private static readonly BOLD_REGEX = /(\*\*|__)((?!\1).+?)\1/g;
	private static readonly ITALIC_REGEX = /(\*|_)((?!\1).+?)\1/g;
	private static readonly CODE_BLOCK_REGEX = /```([\s\S]*?)```/g;
	private static readonly INLINE_CODE_REGEX = /`(.+?)`/g;
	private static readonly UNORDERED_LIST_REGEX = /^(\s*)[*+-]\s+(.+)$/;
	private static readonly ORDERED_LIST_REGEX = /^(\s*)\d+\.\s+(.+)$/;
	private static readonly LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
	private static readonly IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]+)")?\)/g;
	private static readonly BLOCKQUOTE_REGEX = /^(>+)\s(.+)$/;
	private static readonly TABLE_ROW_REGEX = /^\|(.+)\|$/;
	private static readonly TABLE_DELIMITER_REGEX = /^\|(?:\s*:?-+:?\s*\|)+$/;
	private static readonly HORIZONTAL_RULE_REGEX = /^(?:[-*_]){3,}$/gm;

	public parse(markdown: string): string {
		if (!markdown) {
			return "";
		}

		let html = markdown;

		// Para este caso particular, se procesa el markdown en orden específico para evitar conflictos
		// Si queremos hacer una implementación más robusta, podemos considerar usar un analizador de sintaxis
		// Algo así como hacen en: https://github.com/wooorm/remark
		html = this.parseCodeBlocks(html);
		html = this.parseHorizontalRules(html);
		html = this.parseTables(html);
		html = this.parseBlockquotes(html);
		html = this.parseLists(html);
		html = this.parseHeadings(html);
		html = this.parseImages(html);
		html = this.parseInlineFormats(html);
		html = this.parseLinks(html);

		return html;
	}

	private parseHeadings(text: string): string {
		return text.replace(MarkdownParser.HEADING_REGEX, (_, level, content) => {
			const headingLevel = Math.min(level.length, 6);
			return this.heading(headingLevel, content.trim());
		});
	}

	private parseHorizontalRules(text: string): string {
		return text.replace(MarkdownParser.HORIZONTAL_RULE_REGEX, "<hr>");
	}

	private heading(level: number, text: string): string {
		return `<h${level}>${text}</h${level}>`;
	}

	private parseCodeBlocks(text: string): string {
		return text.replace(MarkdownParser.CODE_BLOCK_REGEX, (_, code) => {
			return `<pre><code>${this.escapeHtml(code.trim())}</code></pre>`;
		});
	}

	private parseInlineCode(text: string): string {
		return text.replace(MarkdownParser.INLINE_CODE_REGEX, (_, code) => {
			return `<code>${this.escapeHtml(code)}</code>`;
		});
	}

	private parseInlineFormats(text: string): string {
		let result = text;
		result = result.replace(MarkdownParser.BOLD_REGEX, "<strong>$2</strong>");
		result = result.replace(MarkdownParser.ITALIC_REGEX, "<em>$2</em>");
		result = this.parseInlineCode(result);
		return result;
	}

	private parseLists(text: string): string {
		const lines = text.split("\n");
		let html = "";
		const currentList: { type: "ul" | "ol"; indent: number }[] = [];

		for (const line of lines) {
			const unorderedMatch = line.match(MarkdownParser.UNORDERED_LIST_REGEX);
			const orderedMatch = line.match(MarkdownParser.ORDERED_LIST_REGEX);

			if (unorderedMatch || orderedMatch) {
				const match = unorderedMatch || orderedMatch;
				const [, indent, content] = match!;
				const indentLevel = indent.length;
				const listType = unorderedMatch ? "ul" : "ol";

				while (
					currentList.length > 0 &&
					(currentList[currentList.length - 1].indent >= indentLevel ||
						currentList[currentList.length - 1].type !== listType)
				) {
					html += `</${currentList.pop()?.type}>`;
				}

				if (currentList.length === 0 || currentList[currentList.length - 1].indent < indentLevel) {
					currentList.push({ type: listType, indent: indentLevel });
					html += `<${listType}>`;
				}

				html += `<li>${content}</li>`;
			} else {
				while (currentList.length > 0) {
					html += `</${currentList.pop()?.type}>`;
				}
				html += `${line}\n`;
			}
		}

		while (currentList.length > 0) {
			html += `</${currentList.pop()?.type}>`;
		}

		return html;
	}

	private parseLinks(text: string): string {
		return text.replace(MarkdownParser.LINK_REGEX, (_, text, url) => {
			// Le agrego el target blank para que se abra en una nueva pestaña (se podria hacer que sea configurable desde la sintaxis)
			return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
		});
	}

	private parseImages(text: string): string {
		return text.replace(MarkdownParser.IMAGE_REGEX, (_, alt, src, title) => {
			return `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ""} onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}';">`;
		});
	}

	private parseBlockquotes(text: string): string {
		const lines = text.split("\n");
		let html = "";
		let currentQuoteLevel = 0;

		for (const line of lines) {
			const match = line.match(MarkdownParser.BLOCKQUOTE_REGEX);
			if (match) {
				const [, quotes, content] = match;
				const level = quotes.length;

				while (currentQuoteLevel > level) {
					html += "</blockquote>";
					currentQuoteLevel--;
				}
				while (currentQuoteLevel < level) {
					html += "<blockquote>";
					currentQuoteLevel++;
				}

				html += `${content}<br>`;
			} else if (currentQuoteLevel > 0) {
				while (currentQuoteLevel > 0) {
					html += "</blockquote>";
					currentQuoteLevel--;
				}
				html += `${line}\n`;
			} else {
				html += `${line}\n`;
			}
		}

		// Esto es para cerrar todas las citas que faltan
		while (currentQuoteLevel > 0) {
			html += "</blockquote>";
			currentQuoteLevel--;
		}

		return html;
	}

	private parseTables(text: string): string {
		const lines = text.split("\n");
		let inTable = false;
		let html = "";
		let alignments: ("left" | "center" | "right")[] = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line.match(MarkdownParser.TABLE_ROW_REGEX)) {
				const cells = line
					.slice(1, -1)
					.split("|")
					.map((cell) => cell.trim());

				if (!inTable) {
					if (i + 1 < lines.length && lines[i + 1].match(MarkdownParser.TABLE_DELIMITER_REGEX)) {
						inTable = true;
						html += "<table><thead><tr>";

						const delimiters = lines[i + 1]
							.slice(1, -1)
							.split("|")
							.map((d) => d.trim());
						alignments = delimiters.map((d) => {
							if (d.startsWith(":") && d.endsWith(":")) return "center";
							if (d.endsWith(":")) return "right";
							return "left";
						});

						cells.forEach((cell, index) => {
							html += `<th style="text-align: ${alignments[index]}">${cell}</th>`;
						});

						html += "</tr></thead><tbody>";
						i++;
					}
				} else {
					html += "<tr>";
					cells.forEach((cell, index) => {
						html += `<td style="text-align: ${alignments[index]}">${cell}</td>`;
					});
					html += "</tr>";
				}
			} else if (inTable) {
				html += "</tbody></table>";
				inTable = false;
				html += `${line}\n`;
			} else {
				html += `${line}\n`;
			}
		}

		if (inTable) {
			html += "</tbody></table>";
		}

		return html;
	}

	private escapeHtml(text: string): string {
		const escapeMap: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#039;",
		};

		return text.replace(/[&<>"']/g, (match) => escapeMap[match]);
	}
}
