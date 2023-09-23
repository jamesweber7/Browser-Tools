# Browser Tools ![Extension Icon/Logo](Bot-32.png)

This is an extension I use all the time to help me improve my web browsing experience. I made this to be a personal extension back in December 2021, but I've been looking through my old projects and decided to release an unpersonalized version of it.

## Set up
Take the same steps as shown in 2:27-3:10 in this [video](https://www.youtube.com/watch?v=ZM0b95lquso&t=147).

After that, you should copy the data from [default_data.txt](/default_data.txt) and import it to the extension pop up by clicking Data→Import Data then pasting your clipboard (Ctrl+v on Windows or Command+v on Mac). The default data includes data for many of the Sites and Scrapers I use, and should have good examples for you if you intend to make your own.

## Features

![Layout of extension pop-up page](/Screenshots/Layout.png)

### Sites:

![Site for changing the text color on YouTube](/Screenshots/Sites.png)

Sites are used to run code on certain websites you interact with. Each Site includes a title, a url, a code block, a Reload button, and an Automatic/Manual button. If the Site is on Automatic, it will run automatically upon entering the website matching its url. Otherwise, you will need to press the Reload button to get the code to run. 

Note that by default, a Site will run on any website that includes the given url's text (e.g. google.com matches google.com/search?q=dog). You can use a * as a match any pattern (e.g. webwork.*.edu matches webwork.asu.edu and webwork.nau.edu), and you can delimit multiple urls by separating them with commas (e.g. google.com, yahoo.com). You can limit match patterns to only match the url exactly by using quotes (e.g. "https://<zws>google.com" does NOT match https://<zws>google.com/search?q=dog). Be careful - if you use quotes, you will need to precede your domain with https:// or the appropriate scheme.

### Notes:

A space for saving personal notes.

### Scrapers:

![Scrapers for stock prices and Wikipedia](/Screenshots/Scrapers.png)

Scrapers are used to scrape data from a website with a given url. Each Scraper includes a window for displaying response information, a title, a url, and a window for writing code. It also has a Reload Data button, and a button marked Active/Inactive. If it is Active, it will automatically run when you open the popup. Otherwise, you will need to hit Reload Data to run the scraper. The "Features" section has not been implemented (and will probably never be implemented), but you can press the buttons all you want :)

For coding the scrapers, you will receive an XML Http Request object inside of the code block starting with ".xhr {{" and ending with "}}". Don't let the syntax for delimiting the code block confuse you; everything else is vanilla JavaScript - this is just the way I wanted to distinguish between code that runs before receiving the xhr object (before the code block) and code that runs after receiving the xhr object (inside the xhr code block). To display results in the window, use the methods display(string text) or displayHTML(string HTML)

### Gamble:

Not sure whether you want to take a break from your work? Wondering if you should make that new expensive purchase? Debating on reading one more chapter?

Flip the card over, and let it make your decisions for you.

### Calculator:

Note: this is using an old link for the Weber-84, but this should be fixed very soon. 

Use the Weber-84 Graphing Calculator, or use one of many functions for probability and calculus. 

The functions include:
 - derivative, integral
 - factorial, permutation, combination
 - mean, deviation, variance, pmf/pdf and cdf for various probability distributions
 - inverse f⁻¹(C)

and more...

Use ``` -l * ``` to see the list of most of the functions. If you browse through Calculator.js and wish to use a method not listed with this command, use ```Calculator.<function_name>``` to use it.

Use ``` -l ``` in front of a function to see how to use it.

If you are interested in these math functions, check out [Wath.js](https://github.com/jamesweber7/Toolkit.js/blob/master/Wath.js) from my [Toolkit](https://github.com/jamesweber7/Toolkit.js) repository, which should has all these functions and more.

### Code: 

I use this in popup mode to experiment with functions in this extension. 

Use this in tab mode to send code to the tab if you want to have the tab take up the full browser window, without needing to open the web console.

### Mustache:

![Mustaches on the Beatles](/Screenshots/Mustache.png)

Perhaps most useful of all this extension's features, press the mustache button to have a mustache appear in the top left of the page. Drag the mustache onto a picture of your boss's face, and scroll on the mustache to change its size.

### Cool Style:

Press the + to receive access to sliders which can change your tab's text color and background color. 

If you're feeling daring or you're in the mood to punish your eyes, you can also press the Cool Style button to receive a random combination of colors and a font.

### Data:

Copy this extension's data to save a backup or share with your friends, and import your friend's data. At the moment, this just pertains to your Sites, Notes, and Scrapers.

Note on importing data: I'm not 100% confident in the import function working correctly under every edge case. You shouldn't be saving crucial data on this extension anyway, but I'd paste a copy of my data to a text editor of choice before importing new data on top of anything I don't want deleted.

The import function is supposed to work by combining your existing data with the imported data, but I made it dynamically so I don't need to change the algorithm whenever I add a new data structure, which leaves room for unforeseen issues. Import at your own risk.

### Happy Browsing!