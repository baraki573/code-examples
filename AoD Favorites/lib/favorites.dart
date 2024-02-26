import 'package:Video/home.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import 'SizeConfig.dart';
import 'consts.dart';
import 'moor.dart';

class FavoritesPage extends StatefulWidget {
  FavoritesPage(this.hp, {Key key}) : super(key: key);

  final HomePageState hp;

  @override
  State<StatefulWidget> createState() => _FavoritesPageState();
}

enum Sorting { RELEASED, ALPHA, REC_ADDED, WATCHED }

class _FavoritesPageState extends State<FavoritesPage> {
  bool _showMov = true, _showSer = true;
  static Map<String, bool> _filters = {
    "abenteuer": true,
    "action": true,
    "comedy": true,
    "drama": true,
    "erotik": true,
    "fantasy": true,
    "horror": true,
    "mystery": true,
    "romance": true,
    "science fiction": true,
  };

  static Sorting _currentDropdown = Sorting.WATCHED;
  static bool _inverse = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 15),
            DropdownButton(
              value: _currentDropdown,
              items: [
                _menuItem(Sorting.WATCHED, "Angeschaut"),
                _menuItem(Sorting.ALPHA, "Alphabetisch"),
                _menuItem(Sorting.RELEASED, "Veröffentlicht"),
                _menuItem(Sorting.REC_ADDED, "Hinzugefügt"),
              ],
              onChanged: (val) => setState(() => _currentDropdown = val),
            ),
            IconButton(
              icon: Icon(_inverse ? Icons.arrow_upward : Icons.arrow_downward),
              color: Colors.white,
              onPressed: () => setState(() => _inverse = !_inverse),
            ),
            Text("    Filme"),
            Checkbox(
              value: _showMov,
              onChanged: (b) => setState(() => _showMov = b),
              activeColor: Theme.of(context).primaryColor,
            ),
            Text("Serien"),
            Checkbox(
              value: _showSer,
              onChanged: (b) => setState(() => _showSer = b),
              activeColor: Theme.of(context).primaryColor,
            ),
          ],
        ),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 10),
          alignment: Alignment.center,
          height: 30,
          child: Scrollbar(
            thickness: 1.5,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: <Widget>[
                    Center(
                        child: Text(
                      "Genre Filter:    ",
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ))
                  ] +
                  _filters.entries
                      .map(
                        (e) => Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(e.key.toUpperCase()),
                            Checkbox(
                              value: e.value,
                              onChanged: (b) =>
                                  setState(() => _filters[e.key] = !e.value),
                              activeColor: Theme.of(context).primaryColor,
                            ),
                          ],
                        ),
                      )
                      .toList(),
            ),
          ),
        ),
        _favorites(),
      ],
    );
  }

  Widget _favorites() {
    return FutureBuilder(
      future: Database().getEntries(),
      builder: (context, snap) {
        if (snap.hasError) return Text(snap.error.toString());
        if (!snap.hasData) return Center(child: Text("Keine Favoriten"));

        // the data
        List<Favorite> data = snap.data;

        // filter
        if (!_showMov) data = data.where((f) => f.type != "Film").toList();
        if (!_showSer) data = data.where((f) => f.type != "Serie").toList();

        _filters.forEach((key, value) {
          if (!value)
            data.removeWhere((e) => e.genre.toLowerCase().contains(key));
        });

        // sort the entries
        switch (_currentDropdown) {
          case Sorting.RELEASED:
            data.sort((a, b) => a.prodYear.compareTo(b.prodYear));
            break;
          case Sorting.ALPHA:
            data.sort((a, b) => a.name.compareTo(b.name));
            break;
          case Sorting.REC_ADDED:
            data.sort((a, b) => a.addDate.compareTo(b.addDate));
            break;
          case Sorting.WATCHED:
            data.sort((a, b) => b.watchDate.compareTo(a.watchDate));
            break;
          default:
        }

        if (_inverse) data = data.reversed.toList();

        return Expanded(
          child: data.isNotEmpty
              ? SingleChildScrollView(
                  padding: EdgeInsets.symmetric(horizontal: 13, vertical: 10),
                  child: Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: data.map((f) => _singleRect(f)).toList(),
                  ),
                )
              : Center(child: Text("\n\nKeine Favoriten")),
        );
      },
    );
  }

  DropdownMenuItem _menuItem(Sorting s, String t) {
    return DropdownMenuItem(
      value: s,
      child: Text(t, style: Theme.of(context).textTheme.bodyText2),
    );
  }

  Color _getColor(num) {
    switch (num) {
      case 1:
        return Theme.of(context).primaryColor.withOpacity(.5);
      case 2:
        return Colors.red;
      case 3:
        return Colors.orange;
      case 4:
        return Colors.white;
      case 5:
        return Colors.blue;
      case 6:
        return Colors.deepPurple;
      default:
        return Theme.of(context).primaryColor;
    }
  }

  Widget _singleRect(Favorite fav) {
    return ClipRRect(
      borderRadius: BorderRadius.all(Radius.circular(6)),
      child: GestureDetector(
        onTap: () {
          Database().setWatched(fav.id);
          widget.hp.loadURL(HOME_PAGE + "anime/${fav.id}");
        },
        onLongPress: () => Database()
            .setMarked(fav.id, (fav.marked + 1) % MAX_MARKED)
            .then((_) => setState(() {})),
        onDoubleTap: () => Database()
            .setMarked(fav.id, fav.marked == 0 ? MAX_MARKED-1 : (fav.marked - 1))
            .then((_) => setState(() {})),
        child: Container(
          width: horSize(45, 30.8),
          height: horSize(47, 32),
          color: _getColor(fav.marked),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                height: 33,
                alignment: Alignment.center,
                child: Text(
                  fav.name,
                  maxLines: 2,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontWeight: FontWeight.bold, color: Colors.black),
                ),
              ),
              Expanded(
                child: CachedNetworkImage(
                  placeholder: (context, s) => Container(
                    color: Colors.grey[700],
                    alignment: Alignment.center,
                    child: Icon(Icons.image),
                  ),
                  imageUrl: fav.image,
                  fit: BoxFit.fitHeight,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
