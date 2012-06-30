
# TODO

This is an exercise in object-oriented javascript library design. See
[JavaScript Module Pattern In Depth](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
and use that as a reference when designing library components.

* Implement a basic model
    * A document is a collection of measures is a collection of notes that span a whole number of beats

* Render the basic model
    * Render a staff
    * Render time signatures assuming a `*/4` time signature
    * Render the notes assuming a `*/4` time signature

* Expand to support partial beat counts, barring notes together

* Extend the model and renderer to support
    * More advanced time signature types
    * Rests
    * Legato
    * Tempo markers
    * Dynamics
    * Key signatures
    * Accidentals integrated with key signatures
    * Repeats and codas
    * Note accents

* At the document level, support title / composer / copyright / etc

* Expand to support multi-stave systems

* Expand to support tablature notation using the same underlying model,
  or by converting between underlying models.

* Expand so system staves can render the same underlying model

