# Making a Mod

This guide assumes you have already gone through the [getting started guide](getting-started.md). It will walk you through the basics of using TMT to create a mod. Let's get started!

## Setting up mod info

Open mod.js. This is where you define things that are for the mod in general as opposed to layer-specific. For now, modInfo, you can set the mod name and author name, and also the points name, which changes what the game calls your basic points (but they're still referred to as points in the code). Be sure that you set a mod id as well.

## Making a layer

Now for the good stuff! Head into layers.js. There is a basic layer already there (although it has a few redundant things in it.) Let's see what it's doing...

The most important thing is on the first line, where it says `addLayer("p", {` . This is how you create a new layer. The "p" here becomes the layer id, which is used throughout TMT to refer to the layer. You can change the id, but you will have to replace instances of "p" in the tutorial code as well.

A layer is basically a big object with lots of different properties that you can set to create features. For fun customization, you can change a few other things:
    - name: Your layer's name!
    - color: Sets the color of a lot of things for this layer.
    - symbol: The text that appears on this layer's node.
    - resource: The name of this layer's main currency.

Reload the page to see your newly customized layer! You can ignore the other features here, for now. Most of it is involved in calculating how many prestige points you get. For now, let's make an upgrade!

## Upgrades

Upgrades are one of several Big Features in TMT, and most of them work the same way. Most of what applies to upgrades applies to milestones, buyables, etc. To add upgrades to your layer, after all of the other features, add a comma to the end of the last one, and then put:

```js
    upgrades: {

    },
```

"upgrades" is an object, which contains an object for each upgrade. Each upgrade has an id that corresponds to its position. The upgrade "12" will appear as the second upgrade in the first row.

Given that, let's make our first upgrade! Insert this line in between the brackets after "upgrades":

```js
        11: {

        },
```

Reload the page, and an upgrade will appear in the layer's tab! It will just be blank though. We need to fill out its features, which works similarly to giving a layer features. Here are the features we'll need:

```js
    name: "Make this whatever you want!",
    description: "Double your point gain.",
    cost: new Decimal(1),
```

Reload the page, and the upgrade will appear, fully formed! But it won't have any effect when you buy it! To impliment a boost, we need to go to the place where it is calculated. In this case, point gain is calculated in getPointGen in mod.js, so let's head over there.

It's time to explain Decimals. Decimals are a special way of handling numbers over the normal Javascript limit. They are handled in a very different way. To perform any operations, instead of doing x = x + y, you have to do x = x.add(y). x has to be a Decimal, but y can be either a Decimal or Number (regular javascript number). A more detailed description is in [!general-info.md](!general-info.md)

With that knowledge in hand, what we need to do is check if the player has the upgrade, and then boost point gain if so. We can do that by inserting this line between gain being defined and returned:
```js
if (hasUpgrade('p', 11)) gain = gain.times(2)
```

Refresh the page again, and it should work! You are gaining 2 points per second!


## Upgraded upgrades

To be continued...