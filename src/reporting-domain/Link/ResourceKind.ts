export enum ResourceKind {
  /// <summary>
  /// Unknown (default).
  /// </summary>
  Unknown,

  /// <summary>
  /// A <see cref="Report"/>.
  /// </summary>
  Report,

  /// <summary>
  /// JSON document.
  /// </summary>
  Json,

  /// <summary>
  /// An image.
  /// </summary>
  Image,

  /// <summary>
  /// Audio.
  /// </summary>
  Audio,

  /// <summary>
  /// Video.
  /// </summary>
  Video,

  /// <summary>
  /// HTML.
  /// </summary>
  Html,

  /// <summary>
  /// A Microsoft Excel file.
  /// </summary>
  Excel,

  /// <summary>
  /// A CSV file.
  /// </summary>
  Csv,

  /// <summary>
  /// A PDF file.
  /// </summary>
  Pdf,

  /// <summary>
  /// A Zip file.
  /// </summary>
  Zip,

  /// <summary>
  /// Text.
  /// </summary>
  Text,

  /// <summary>
  /// BSON as text.
  /// </summary>
  BsonAsText,

  /// <summary>
  /// BSON as bytes.
  /// </summary>
  BsonAsBytes,
}
