
Layout Engine
=============

The layout engine is an extensible system for generating and positioning
glyphs from a document. You can invoke it by calling `Notate.layout()`.

As input, the layout engine takes a command list, as described in
[format.markdown](https://github.com/davekilian/notate.js/blob/master/doc/intermediate.markdown).

As output, the layout engine produces a glyph tree, as described in
[intermediate.markdown](https://github.com/davekilian/notate.js/blob/master/doc/intermediate.markdown).

You can pass the output glyph tree directly into `Notate.render()` in order to
draw the object.

## Types of Glyphs

The layout engine accepts two types of glyphs: 'block' glyphs and 'annotation'
glyphs.

### Block Glyphs

Block glyphs are the backbone of a musical document. 

Block glyphs are glyphs which appear in measures and occupies horizontal space
(overlapping is not allowed). Examples include time/key signature markers,
notes, rests, and measure bars.

Block glyphs appear in the command list as 'show' commands.

### Annotations

Annotations are glyphs which add extra markup to one or more block glyphs.

Annotation glyphs appear above, below or inline with block glyphs in a
document. They do not affect how block glyphs are laid out, but are affected by
how block glyphs are laid out. As such, annotations accept a list of 'target'
block glyphs to annotate.

Annotations appear in the command list as 'begin' and 'end' commands.

## Layout Phases

The layout engine produces and lays out note glyphs in the following steps:

### 1. Block Glyph Generation

During this step, notate scans the command list and produces two lists:

* The first list is an ordered list of block glyphs in the order which they
  should appear in the document. At this point no glyph has been laid out
  spatially within a document.

* The second list is a mapping between begin/end commands and the glyphs the
  commands modify. However, at this phase the commands are not yet convereted
  into annotation glyphs.

### 2. Block Glyph Spacing

During this step, notate examines the block glyphs and lays them out
horizontally. The engine calls into each glyph to determine its size and its
vertical height on the staff, and then lays out the glyphs horizontally
adjacent to each other.

When this phase finishes, the list of block glyphs will be spatially laid out
relative to a single imaginary staff of infinite horizontal length.

### 3. Line Breaking

During this step, notate examines each measure on the staff, and splits each
measure into individual lines based on the document's maximum width. When this
phase finishes, the list of block glyphs will have been split into multiple
lists of block glyphs, each of which is spatially laid out relative to a parent
staff.

### 4. Annotation Generation

During this step, notate generates annotation glyphs for the begin commands in
the document. The layout engine splits the annotation into staves: if a begin
command's target glyphs span multiple staves, then the layout engine splits the
begin command into multiple annotation glyphs, each of which targets the glyphs
for a single staff.

The layout engine also informs each glyph whether it is a continuation of a
different annotation glyph, and whether it will be continued by a different
annotation glyph.

When this phase finishes, the layout engine has a list of block glyphs and
annotation glyphs for each staff in the document.

### 5. Staff Generation

During this step, notate measures the glyphs in each staff, and determines the
vertical height of each staff. It then generates staff glyphs containing each
of the block and annotation glyphs, and then vertically stacks the glyphs into
a single document glyph.

This phase completes the layout process. The final layout contains a single
root document glyph, containing one or more staff glyphs, each of which contain
zero or more block glyphs and annotations. Each block glyph and annotation may
contain its own glyph hierarchy.

