import 'package:Video/home.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AOD',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      theme: ThemeData(
        primaryColor: Color(0xFFAEC23C),
        //primarySwatch: MaterialColor(0xFFAEC23C, {0: Color(0xFFAEC23C)}),
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      darkTheme: ThemeData(
          primaryColor: Color(0xFFAEC23C),
          //primarySwatch: MaterialColor(0xFFAEC23C, {0: Color(0xFFAEC23C)}),
          visualDensity: VisualDensity.adaptivePlatformDensity,
          canvasColor: Color(0xFF353638),
          textTheme: Typography.whiteCupertino.copyWith(
            bodyText2: TextStyle(color: Colors.white),
          )),
      home: HomePage(),
    );
  }
}
