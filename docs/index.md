# Aim
The app was designed for easy fetching specific Eurostat data and exploring them to create pretty reports.

# Description
App contains several features:
  - fetching specific data using Eurostat web services,
  - saving currently fetched dataset in local storage (and retrieving for further exploration),
  - grid to display data featuring filtering and sorting,
  - chart generator for manipulated data,
  - WYSIWYG editor to create a report.

# Author
Damian Plata

# Manual
>At first, user is able to see dropdown menu on top of the app letting to choose dataset to fetch from Eurostat.
The WYSIWYG editor is also available on the right side of page. To make tools active, user should click inside text area. Toolbar contains several formatting buttons, such as: headers, lists, **font style manipulators**, text align, indents, hyperlinks, image/video insertion, ability to undo/redo changes, clear formatting, switch to html mode and also character/word count. Button under text area lets user to see efects in new window.

> After pressing 'fetch' button and succesful data download, an information about which dataset was fetched appears next to it. Right after it shows also a button to save currently fetched data in local storage.
Data are instantly loaded to a grid on the left. The grid can be filtered by pressing a button on the right side of column's header, choosing filter type and inserting filter query. To sort a column ascending, click anywhere else on the header. Click again for descending order. Third click clears sorting.
User can make an image snapshot of current visible part of grid by pressing newly appeared button under WYSIWYG editor. Generating picture can take a while so suitable information shows below the button. Clicking anywhere will let Angularjs to update directive's value and display images's data url in the same place where the mentioned information was shown, which can be copied and inserted to the editor using image button and pasting the url or <img> tag in html mode.
Simultaneously, chart generation options appears under dataset dropdown menu. User can choose the chart type to be linear, bar or pie. Unlike the first two options, pie chart doesn't take a "data series" argument so if it's chose, "data series" section will hide and an information will show below, also with a hint to set filter to show only one value of property different than "data label". The both options are preclusive, so if you choose one in specific select box, it would be inactive in the second. To change the choice use "Switch data properties" button.

>Pressing "Draw!" button will make a chart visible. Data series and exact values shows after hovering chart's points referring to data labels. This also makes appear another button below the editor, which could be used to make a chart's snapshot in the same way that it was able to do with grid.

>The last feature is mentioned before local storage usage. After pressing the save button, whole currently fetched dataset will store. The information with the dataset's label and "load" button will show below.
Pressing "load" button will push stored data to the grid.

## That's all for now. Have Fun!
