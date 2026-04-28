export const Router = {
   currentRoute: 'startMenu',
   history: [], 
   
   navigate: function(newRoute) {
      if (this.currentRoute !== newRoute) {
         this.history.push(this.currentRoute);
         this.currentRoute = newRoute;
         console.log(`Navigated to: ${newRoute}`);
      }
   },
   goBack: function() {
      if (this.history.length > 0) {
         this.currentRoute = this.history.pop();
      }
   }
};