import 'package:html/parser.dart' show parse;
import 'package:http/http.dart' as http;

Future<Map> getData(String url) async {
  if (url == "FAV" || !url.contains("/anime/"))
    return {"title": url == "FAV" ? "Favoriten" : "AOD"};
  var r = await http.get(Uri.parse(url));
  var doc = parse(r.body);

  var data = doc
      .getElementsByClassName("vertical-table")
      .first
      .getElementsByTagName("td");

  var title = doc.head
      .getElementsByTagName("title")
      .first
      .text
      .replaceAll(" bei Anime on Demand online schauen", "");

  bool isMovie = int.tryParse(data[5].text) == null ||
      title.toLowerCase().contains(" film") ||
      title.toLowerCase().contains(" movie");

  return {
    "title": title,
    "image": doc.body
        .getElementsByClassName("fullwidth-image anime-top-image")
        .first
        .attributes["src"],
    "type": isMovie ? "Film" : "Serie",
    "year": int.parse(data[0].text),
    "genre": data[3].text,
    "episodes": isMovie ? "1" : data[4].text.replaceAll("\n", "").trim(),
    "fsk": int.parse(data[isMovie ? 4 : 5].text),
    //"body": doc.body,
  };
}
