First argument must be path to file

The following Elements hopefully match as closely as possible to CommonMark Spec:

* Escaping Characters
  - \*Escaped Emphasis

* Emphasis and Strong Emphasis
  - *Asterisk Emphasis*
  - _Underscore Emphasis_
  - **Asterisk Strong Emphasis**
  - __Underscore Strong Emphasis__

* ATX Headers
  # Heading
  ## Heading 2
  ### Heading 3
  #### Heading 4
  ##### Heading 5
  ###### Heading 6

* Thematic Breaks
  Underscore
  ___
  Hyphen
  ---
  Asterisk
  ***

---
# Markdown

* Text:
  * Any " a-z A-Z 0-9 . ' ' " Creates text on the page. Multiple Spaces or Tabs create additional whitespace text, and is added directly to the document.

* Escape:
  * A backslash will escape whatever character comes directly after it, without any whitespace.

* Emphasis:
  * If two emphasis characters are side by side without any whitespace this will create Strong Emphasis
  * If only one emphasis character is broken by whitespace on the left side it will create Emphasis.

* Thematic Break
  * Three or more *, -, _ will create a thematic break.

* Header
  * Up to 6 # can be placed without any whitespace to create the corresponding Header value. Above 6 and they are all added directly as text.

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
