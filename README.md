# CSGOworld
## Reborn of the [CS:GO Opencase Simulator](https://github.com/laFreeFall/CS-GO-OpenCase-Simulator), SPA built with Vue.js instead of previous jQuery mess.
Website provides the opportunity to open CS:GO cases, play roulette and coinflip, make trade-up contracts, and a little bit more. Most of the available features will be described below.
Frontend part is built fully with Vue.js almost half a year ago and needs some refactoring. Backend is on Laravel, but at the moment it also needs refactoring and will be attached later.


## Brief description with main features
 
 > If you want don't want to encounter with longreads below, follow the [link](https://imgur.com/a/Hjhcm) and watch an [album of screenshots on imgur](https://imgur.com/a/Hjhcm) without huge amount of text.
 ### Case opening
 ![Case opening](https://i.imgur.com/jDyoXLx.gif)
 - List of all CS:GO cases and collections available for opening.
 - Chances of getting rare items are equals to [official](https://www.reddit.com/r/GlobalOffensive/comments/6zd9yx/perfect_world_csgo_has_finally_published_their/) ones.
 - If the item you got costs less than $1 you can't sell it for insite currency, you may only get rid of it or keep it in the inventory.
 - If the item costs more than $1 you may also sell it at the rate $1 = 1 diamond. Later you may use these diamonds to spin roulette.

  ### Roulette
 ![Roulette](https://i.imgur.com/oFpTPWA.gif)
 - From the registration you'll have 0 diamonds (currency that can be used for betting). But you can earn them by selling items from your inventory.
 - Winning coefs are the same as on the original roulettes: 2x for both red and black and 14x for green.
 - It's allowed to bet on two colors at once.
 
   ### Trade-up contracts
 ![Trade-up contracts](https://i.imgur.com/OEBVw8y.gif)
 - Contracts available for each item quality (from the light-blue to purple), except red (covert) and rare (knives, gloves).
 - There are different contrats for the items with the same quality if they're stattrak or souvenir.
 - By hovering on your inventory in contracts you may see popover with a list of the items from this collection but with higher quality (that you might get as an award after contract).
 - When adding items to the contract you may open Trade-up probabilities block where all available items will be shown with corresponding chances to get them.
 - If you add items from different collections chances are based on their ratio.
 
   ### Coinflip
   ![Coinflip](https://i.imgur.com/umRVQJo.gif)
   - You may pick from 1 up to 10 items from your inventory.
   - Enemy's bet will be selected in accordance with yours (tolerances are 10% in both sides (if your bet value is $100, your enemy's bet value may vary from $90 to $110 with corresponding chances)).
   - Winner takes it all (returns own items and gets loser's ones).
   - You may pick your side (heads or tails, CT or T) before the flip starts.
 
   ### Authorization
 ![Authorization](https://i.imgur.com/z3ZVTzi.gif)
 Brief description of how authorization works in the app.
 - User may log in its profile by filling the login form with email and password
 - Backend checks incoming data for the matching with the existing users records.
 - If it doesn't fail it generate an access and refresh tokens and send it back to the user.
 - User stores tokens in local storage to keep them after closing a browser tab and set authorization header with bearer access_token to all requests to allow server recognize an authenticated user
 - If user logs out, local storage clears and authorization headers resets.
  

> If you want to see more - watch the [full screenshots album on imgur](https://imgur.com/a/Hjhcm).

