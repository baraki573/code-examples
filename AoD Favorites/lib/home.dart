import 'package:Video/SizeConfig.dart';
import 'package:Video/favorites.dart';
import 'package:Video/moor.dart';
import 'package:back_button_interceptor/back_button_interceptor.dart';
import 'package:clipboard/clipboard.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:stack/stack.dart' as s;
import 'package:url_launcher/url_launcher.dart';

import 'connection.dart';
import 'consts.dart';

class HomePage extends StatefulWidget {
  HomePage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => HomePageState();
}

enum Modes { WEB, FAV }

class WebPage {
  final String url;
  int pos;

  WebPage(this.url, {this.pos = 0});

  @override
  String toString() {
    return "<$url@$pos>";
  }
}

class HomePageState extends State<HomePage> {
  GlobalKey<ScaffoldState> _keyScaffold = GlobalKey<ScaffoldState>();

  //Modes _mode = Modes.WEB;
  bool _hide = false, _search = false;
  FocusNode _node = FocusNode();

  String get currentURL => _history.top().url;
  InAppWebViewController _wCtrl;

  //int _lastScroll = 0;

  s.Stack<WebPage> _history = s.Stack<WebPage>();

  @override
  void initState() {
    super.initState();
    _history.push(WebPage(HOME_PAGE));
    BackButtonInterceptor.add(_goBack);
  }

  @override
  void dispose() {
    BackButtonInterceptor.remove(_goBack);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    if (_search && (_keyScaffold.currentState?.isDrawerOpen ?? false))
      _search = false;
    return Scaffold(
      key: _keyScaffold,
      appBar: _getAppBar(),
      drawer: _getDrawer(),
      body: _getBody(),
      floatingActionButton: _floatingButtonBackup(),
    );
  }

  PreferredSizeWidget _getAppBar() {
    if (_hide)
      return PreferredSize(
        preferredSize: Size.zero,
        child: Container(),
      );
    return AppBar(
      title: _search
          ? TextFormField(
              focusNode: _node,
              style: TextStyle(color: Colors.black, fontSize: 18),
              cursorColor: Colors.black,
              decoration: InputDecoration(border: InputBorder.none),
              //autofocus: true,
              onFieldSubmitted: (s) {
                //TODO restliche replacements
                s = s.replaceAll("%", "%25");
                s = s.replaceAll("+", "%2B");
                s = s.replaceAll(" ", "+");

                setState(() => _search = false);
                loadURL(HOME_PAGE + "animes/?term=$s");
              },
            )
          : FutureBuilder(
              future: getData(currentURL),
              builder: (context, snap) {
                if (!snap.hasData) return Text("");
                return Text(snap.data["title"]);
              }),
      actions: [
        !_search && currentURL != "FAV"
            ? Padding(
                padding: EdgeInsets.only(right: 13),
                child: GestureDetector(
                  onTap: () => _wCtrl?.reload()?.then((v) => print("Reload")),
                  child: Icon(Icons.refresh),
                ),
              )
            : Container(),
        Padding(
          padding: EdgeInsets.only(right: 13),
          child: GestureDetector(
            onTap: () {
              //FocusNode().requestFocus();
              setState(() => _search = !_search);
              if (_search) _node.requestFocus();
            },
            child: Icon(Icons.search),
          ),
        )
      ],
    );
  }

  Widget _getDrawer() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          Theme(
            data: Theme.of(context)
                .copyWith(textTheme: Typography.blackCupertino),
            child: DrawerHeader(
              margin: EdgeInsets.only(bottom: 2),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  GestureDetector(
                    onTap: () async => await canLaunch(currentURL)
                        ? launch(currentURL)
                        : print(currentURL),
                    child: Text(currentURL, maxLines: 3),
                  ),
                  Container(height: verSize(5, 5)),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("UI verstecken"),
                      Switch(
                        value: _hide,
                        onChanged: (b) {
                          setState(() => _hide = b);
                          if (_hide)
                            SystemChrome.setEnabledSystemUIOverlays([]);
                          else
                            SystemChrome.setEnabledSystemUIOverlays(
                                SystemUiOverlay.values);
                          Navigator.pop(context);
                        },
                      )
                    ],
                  ),
                  Expanded(
                    child: Container(
                      alignment: Alignment.bottomRight,
                      child: Text("Version 1.4.0"),
                    ),
                  ),
                ],
              ),
              decoration: BoxDecoration(color: Theme.of(context).primaryColor),
            ),
          ),
          ListTile(
            title: Text("Home"),
            onTap: () => loadURL(HOME_PAGE, andPop: true, save: true),
          ),
          ListTile(
            title: Text("Favoriten"),
            onTap: () {
              loadURL("FAV", save: true);
              Navigator.pop(context);
            },
          ),
          /*ListTile(
              title: Text("Letzte Seite"),
              onTap: () {
                Navigator.pop(context);
                _goBack(false, null);
              }),*/
          //Divider(color: Colors.black, height: 1, thickness: 1),
          ListTile(
            title: Text("Alle Animes"),
            onTap: () =>
                loadURL(HOME_PAGE + "animes", andPop: true, save: true),
          ),
          ListTile(
            title: Text("News"),
            onTap: () =>
                loadURL(HOME_PAGE + "articles", andPop: true, save: true),
          ),
          Divider(color: Colors.black, height: 1, thickness: 1),
          ListTile(
            title: Text("Daten Updaten"),
            onTap: () {
              Navigator.pop(context);
              Database()
                  .updateData()
                  .then((_) => _showSnack("Alles aufgeräumt!"));
            },
          ),
          ListTile(
            title: Text("Clear Web Cache"),
            onTap: () {
              Navigator.pop(context);
              _wCtrl.clearCache().then((_) => _showSnack("Cache gelöscht!"));
            },
          ),
          ListTile(
            title: Text("Export/Import"),
            onTap: () => showDialog(
              context: context,
              builder: (context) => _dialog(context),
            ),
          ),
        ],
      ),
    );
  }

  void _showSnack(String text, {int sec = 2}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
        duration: Duration(seconds: sec),
      ),
    );
  }

  Widget _dialog(context) {
    return AlertDialog(
      backgroundColor: Theme.of(context).canvasColor,
      title: Text("Export/Import"),
      content: Text("Mit dem Export werden alle gespeicherten Daten "
          "in die Zwischenablage kopiert.\n"
          "Beim Import ist dies genau andersherum: In der Zwischenablage"
          "liegende Daten werden eingelesen und überschreiben ggf. vorhandene."),
      actions: [
        TextButton(
          child: Text(
            "Export",
            style: TextStyle(color: Theme.of(context).primaryColor),
          ),
          onPressed: () async {
            Navigator.pop(context);
            await FlutterClipboard.copy(await Database().export());
            Navigator.pop(context);
            _showSnack("In Zwischenablage exportiert!");
          },
        ),
        TextButton(
          child: Text(
            "Import",
            style: TextStyle(color: Theme.of(context).primaryColor),
          ),
          onPressed: () async {
            Navigator.pop(context);
            bool b = await Database().import(await FlutterClipboard.paste());
            Navigator.pop(context);
            _showSnack(
                b ? "Aus Zwischenablage importiert!" : "Fehler beim Import.");
          },
        ),
      ],
    );
  }

  Widget _floatingButtonBackup() {
    if (_hide) return Container();

    var children = <Widget>[
      Container(width: 10, height: 0),
      FloatingActionButton(
        onPressed: () => _goBack(true, null),
        /*() async {
          if (_wCtrl == null) return;
          if (_mode == Modes.WEB && await _wCtrl.canGoBack())
            await _wCtrl.goBack();
        },*/
        child: Icon(Icons.arrow_back),
        backgroundColor: Theme.of(context).primaryColor,
      )
    ];
    if (!_hide && currentURL.contains("/anime/")) {
      int id;
      print(currentURL);
      try {
        id = int.parse(currentURL.substring((HOME_PAGE + "anime/").length));
      } catch (e) {
        print(currentURL);
        return Text("AAA");
      }
      children.insert(
          0,
          FutureBuilder(
              future: Database().isFav(id),
              builder: (context, snap) {
                if (snap.hasError || !snap.hasData) return Container(height: 0);
                bool b = snap.data;

                return FloatingActionButton(
                  onPressed: () async {
                    if (b)
                      Database().deleteEntry(id);
                    else {
                      var d = await getData(currentURL);
                      Database().putEntry(
                        id,
                        name: d["title"],
                        image: d["image"],
                        type: d["type"],
                        prodYear: d["year"],
                        genre: d["genre"],
                        epNum: d["episodes"],
                        fsk: d["fsk"],
                      );
                    }
                    setState(() {});
                  },
                  child: Icon(
                      b ? FontAwesomeIcons.solidHeart : FontAwesomeIcons.heart),
                  backgroundColor: Theme.of(context).primaryColor,
                );
              }));
    }
    return Row(children: children, mainAxisSize: MainAxisSize.min);
  }

  Widget _floatingButton() {
    if (!_hide && currentURL.contains("/anime/")) {
      int id;
      try {
        id = int.parse(currentURL.substring((HOME_PAGE + "anime/").length));
      } catch (e) {
        print(currentURL);
        return Text("Fehler");
      }
      return FutureBuilder(
          future: Database().isFav(id),
          builder: (context, snap) {
            if (snap.hasError || !snap.hasData) return Container(height: 0);
            bool b = snap.data;

            return FloatingActionButton(
              onPressed: () async {
                if (b)
                  Database().deleteEntry(id);
                else {
                  var d = await getData(currentURL);
                  Database().putEntry(
                    id,
                    name: d["title"],
                    image: d["image"],
                    type: d["type"],
                    prodYear: d["year"],
                    genre: d["genre"],
                    epNum: d["episodes"],
                    fsk: d["fsk"],
                  );
                }
                setState(() {});
              },
              child: Icon(
                  b ? FontAwesomeIcons.solidHeart : FontAwesomeIcons.heart),
              backgroundColor: Theme.of(context).primaryColor,
            );
          });
    }
    return Container();
  }

  void loadURL(String url, {bool andPop = false, bool save = false}) {
    if (url == "") return;
    //print("Current Top: ${_history.top()}, ToPush: $url");
    if (save) {
      var top = _history.top();
      _wCtrl?.getScrollY()?.then((v) {
        top.pos = v;
        print("SAVED: <${top.url}@$v>");
      });
    }
    if (currentURL != url) _history.push(WebPage(url));

    if (url != "FAV") {
      setState(() {
        //_mode = Modes.WEB;
        _search = false;
      });
      _wCtrl?.loadUrl(urlRequest: URLRequest(url: Uri.parse(url)));
    } else {
      setState(() {
        //_mode = Modes.FAV;
        _wCtrl = null;
      });
    }

    if (andPop) Navigator.pop(context);
  }

  bool _goBack(bool stopDefaultButtonEvent, RouteInfo info) {
    print("BACK BUTTON!");
    WebPage s = _history.pop();
    print("Pop: $s");
    if (_history.isEmpty) {
      _history.push(WebPage(HOME_PAGE));
      print("EMPTY");
      /*showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Hinweis", style: TextStyle(color: Colors.black)),
          content:
              Text("App schließen?", style: TextStyle(color: Colors.black)),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("Nein"),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
              },
              child: Text("Ja"),
            ),
          ],
        ),
      );*/
      return false;
    }
    s = _history.top();
    print("Top: $s");
    if (s.url.contains("FAV"))
      setState(() {
        //_mode = Modes.FAV;
        _wCtrl = null;
      });
    else {
      //_mode = Modes.WEB;
      loadURL(s.url);
    }
    /*if (_mode == Modes.WEB) {
      if (_wCtrl == null) return true;
      _wCtrl.canGoBack().then((b) {
        if (b)
          _wCtrl.goBack();
        else if (_currentURL.replaceAll(HOME_PAGE, "").length > 1) {
          print("BB");
          setState(() {
            _wCtrl = null;
            _mode = Modes.FAV;
          });
        }
      });
    }
    else loadURL("");*/
    return true;
  }

  Widget _getBody() {
    if (currentURL.contains("FAV")) return FavoritesPage(this);

    return InAppWebView(
      onWebViewCreated: (ctrl) => _wCtrl = ctrl,
      initialUrlRequest: URLRequest(url: Uri.parse(currentURL)),
      //javascriptMode: JavascriptMode.unrestricted,
      onLoadStart: (ctrl, uri) {
        String url = uri.toString().replaceAll("www.", "");
        var top = _history.top();
        if (top.url != url)
          _wCtrl?.getScrollY()?.then((v) {
            top.pos = v;
            print("SAVED: <${top.url}@$v>");
          });

        if (currentURL != url && url != "about:blank") {
          print("CURRENT: ${_history.top()}");
          setState(() => _history.push(WebPage(url)));
          print("PUSHED: <$url@0>");
        }
      },
      onEnterFullscreen: (ctrl) => setState(() => _hide = true),
      onExitFullscreen: (ctrl) => setState(() => _hide = false),
      onLoadStop: (ctrl, url) {
        if (_history.top().pos > 0) {
          _wCtrl
              ?.scrollTo(x: 0, y: _history.top().pos)
              ?.then((_) => print("SCROLLED TO: ${_history.top()}"));
        }
      },
      /*navigationDelegate: (req) {
        var url = req.url.replaceAll("www.", "");
        if (!url.contains(HOME_PAGE)) {
          print("Prevented: $url");
          return NavigationDecision.prevent;
        }
        _wCtrl?.getScrollY()?.then((v) {
          _history.top().pos = v;
          print("SAVED: <$currentURL@$v>");
        });
        return NavigationDecision.navigate;
      },*/
    );
  }
}
