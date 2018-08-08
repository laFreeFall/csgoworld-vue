<template>
  <div class="container">
    <div class="row col-md-8 col-md-offset-2">
      <h1 class="text-center">News about project</h1>
      <ul class="list-group">
        <li class="list-group-item text-left" v-for="pieceOfNews in news">
          {{ pieceOfNews.body }}
          <span class="pull-right">{{ pieceOfNews.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* What have I done
* Added parser for base knives
* Fixed parser for base items
* Added case_item table
* Implemented case_item table seeding system depending on knives and case items ids
* Fixed list of case base items with new relations type
 */

/* What should I do tomorrow
* Download new .json from OPskins with items` prices
* Fix parser for items
* Create parser for knives
* Seed items for first 10 cases = fix opencase script
 */

  export default {
    data () {
      return {
        todos: [
          'Make one component for both opencase and roulette',
          'Add validation to props'
        ],
        news: [
          {
            body: 'Implemented betting system',
            date: '09.11.17'
          },
          {
            body: 'Implemented all the buttons to control bet',
            date: '08.11.17'
          },
          {
            body: 'Created roulette_logs table on backend and implemented fetching recent spins from database',
            date: '08.11.17'
          },
          {
            body: 'Added recent spins div',
            date: '08.11.17'
          },
          {
            body: 'Added spinning icon when Status is continuing',
            date: '08.11.17'
          },
          {
            body: 'Added Roulette Status',
            date: '08.11.17'
          },
          {
            body: 'Implemented cubic bezier curve for more realistic opencase animation',
            date: '07.11.17'
          },
          {
            body: 'Parsed date of receiving item with moment.js in readable format',
            date: '07.11.17'
          },
          {
            body: 'Set correct timezone (for datetime of receiving item)',
            date: '07.11.17'
          },
          {
            body: 'Refactored selling and deleting items (mergin them into one function) on both frontend and backend',
            date: '06.11.17'
          },
          {
            body: 'Implemented selling items from the inventory',
            date: '06.11.17'
          },
          {
            body: 'Moved item modal to ItemModal component, which can be reused later',
            date: '06.11.17'
          },
          {
            body: 'Moved item modal from InventoryItem (it created for every inventory item)',
            date: '06.11.17'
          },
          {
            body: 'Implemented different alerts text if there are no skins at all or only by user`s request',
            date: '06.11.17'
          },
          {
            body: 'Implemented alert if there are no skins by request',
            date: '06.11.17'
          },
          {
            body: 'Implemented live changing amount of pages depending on search query',
            date: '06.11.17'
          },
          {
            body: 'Implemented button to clear live search query on inventory page',
            date: '06.11.17'
          },
          {
            body: 'Implemented live search on inventory page',
            date: '06.11.17'
          },
          {
            body: 'Showing total amount of pages on inventory page',
            date: '06.11.17'
          },
          {
            body: 'Disabled going to the previous page on the inventory when user is on the 1st page',
            date: '06.11.17'
          },
          {
            body: 'Disabled going to the next page on the inventory if it`s the last one',
            date: '06.11.17'
          },
          {
            body: 'Implemented pagination on inventory page',
            date: '06.11.17'
          },

          {
            body: 'Implemented float bar for displaying position of item`s float value',
            date: '04.11.17'
          },
          {
            body: 'Made modal dialog for inventory items and filled with info',
            date: '04.11.17'
          },
          {
            body: 'Extracted method for lightning items` colors in mixin',
            date: '04.11.17'
          },
          {
            body: 'Implemented popover on case hovering with list of items in it',
            date: '04.11.17'
          },
          {
            body: 'Implemented fade border for inventory page items with border-radius',
            date: '04.11.17'
          },
          {
            body: 'Implemented total price of user`s inventory calculating',
            date: '03.11.17'
          },
          {
            body: 'Made basic markup for inventory page items with corner pills',
            date: '03.11.17'
          },
          {
            body: 'Created user inventory page',
            date: '03.11.17'
          },
          {
            body: 'Added storing item after case opening to user`s inventory',
            date: '03.11.17'
          },
          {
            body: 'Implemented authentication and login system',
            date: '03.11.17'
          },
          {
            body: 'Implemented random width margin on the OpenCase page',
            date: '02.11.17'
          },
          {
            body: 'Created BaseItems block template for like items you might get after case opening',
            date: '02.11.17'
          },
          {
            body: 'Added list of items case contains below OpenCase window',
            date: '02.11.17'
          },
          {
            body: 'Implemented OpenCase scrolling via CSS-transitions (not via JS/jQuery plugins as it was before)',
            date: '02.11.17'
          },
          {
            body: 'Released first beta version of Cases list page',
            date: '01.11.17'
          },
          {
            body: 'Released first beta version of OpenCase Simulator page',
            date: '01.11.17'
          }
        ]
      }
    }
  }
</script>