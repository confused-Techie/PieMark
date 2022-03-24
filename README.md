# PieMark

PieMark is a strict MarkDown parser, built with the intention of building simple webpages, and a focus on creating Golang HTML Templates.

While the features of Markdown that are implemented within PieMark follow the CommonMark Spec, it also includes additional features.

# Running PieMark:

First argument must be path to file

````
piemark ./file.md
````

# PieMark Specific Features:

---
# CommonMark Markdown Spec:

* Text:
  * Any " a-z A-Z 0-9 . ' ' " Creates text on the page. Multiple Spaces or Tabs create additional whitespace text, and is added directly to the document.

* Escape:
  * A backslash will escape whatever character comes directly after it, without any whitespace.

* Emphasis:
  * If two emphasis characters are side by side without any whitespace this will create Strong Emphasis
  * If only one emphasis character is broken by whitespace on the left side it will create Emphasis.
  * Emphasis Characters:
    - _ *

* Thematic Break
  * Three or more *, -, _ will create a thematic break, without any whitespace breaks.

* Header
  * Up to 6 '#' can be placed without any whitespace to create the corresponding Header value. Above 6 and they are all added directly as text.

* Links
  - A Text Link can and should contain a Title, Link Text, and of course the destination URL.
  - The format of such a link is the following:
    ````
    [Text](/destination "Title")
    ````
  - The Link and Title can be left blank, leaving the resulting text only.
  - Links MUST contain the Link Text, even if all other items are blank.

* Images
  - Images can and should contain a Title, Alt Text, and of course the destination of the image.
  - The format is the following:
    ````
    ![altText](/url "titleText")
    ````
  - An Image can be missing the Alt Text, and Title, but MUST have the URL.

# AST

* Emphasis is added as a standalone-tag, meaning that the AST will add it everytime it sees it.

## AST Types

* 'text'
* 'Header'
* 'strong_emphasis'
* 'emphasis'
* 'Thematic_Break'
* 'Paragraph'
* 'unknown'
