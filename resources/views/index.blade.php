<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Gymshark</title>
    <base href="/" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="{{asset('/dist/angular/browser/assets/images/favicon.png')}}" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            height: 100%;
            width: 100%;
            overflow-x: hidden;
        }
    </style>
    <link rel="stylesheet" href="{{asset('/dist/angular/browser/styles.css')}}">
</head>

<body>
    <app-root></app-root>
    <script src="{{asset('/dist/angular/browser/polyfills.js')}}" type="module"></script>
    <script src="{{asset('/dist/angular/browser/main.js')}}" type="module"></script>
</body>

</html>