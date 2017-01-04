angular.module('drinkMe')
    .service('appdata', function ($q, UtilitySrv) {
        var products = [];
        var store_products = [];
        var requestProducts = [];
        var orders = [];
        var categories = [];
        var type = [];
        var brand = [];
        var total = 0;
        var totalCost = 0;
        var checkout_products = [];
        var userOrders = [];
        var products_of_brand = [];
        var favourite_orders = [];
        var favourite_products = [];
        var results = [];
        var dash_products = [];
        var theme = "css/frouta_theme.css"; //default theme
        var current_products = [];

        var bread2 = "";
        var bread3 = "";
        var bread4 = "";

        var notifications = [];
        var notification = "";
        var receivedNotification = false;


        var set_theme = function (t){
            theme = t;
        }

        var get_theme = function(){
            return theme;
        }

        var set_receivedNotification = function (status) {
            receivedNotification = status;
        }

        var get_receivedNotification = function () {
            return receivedNotification;
        }

        var set_notifications = function (not) {
            notification = not;
        }

        var get_notifications = function () {
            return notification;
        }

        var set_requestProducts = function (rp) {
            requestProducts = rp;
        }

        var add_requestProducts = function (rp) {
            console.log(requestProducts);
            console.log(rp);
            requestProducts.push(rp);
        }

        var set_requestProducts = function (rp) {
            requestProducts = rp;
        }

        var set_bread2 = function (br) {
            bread2 = br;
        }

        var set_bread3 = function (br) {
            bread3 = br;
        }

        var set_bread4 = function (br) {
            bread4 = br;
        }

        var get_bread2 = function () {
            return bread2;
        }

        var get_bread3 = function () {
            return bread3;
        }

        var get_bread4 = function () {
            return bread4;
        }

        //        var set_products = function (pr) {
        //            products = pr;
        //            window.localStorage.setItem('dash_products', JSON.stringify(products));
        //        }

        var set_dash_products = function (pr) {
            return $q(function (resolve, reject) {
                dash_products = pr;
                setTimeout(function () {
                    window.localStorage.setObject('dash_products', pr);
                    resolve();
                }, 500)

            });
        }
        var set_userOrders = function (uo) {
            userOrders = uo;
            window.localStorage.setItem('user_orders', JSON.stringify(userOrders));
        }
        var set_categories = function (cat) {
            categories = cat;
            window.localStorage.setObject('cat_root', cat);
        }
        var set_total = function (t) {
            total = t;
            window.localStorage.setItem('total', total);
        }
        var set_totalcost = function (tcost) {
            totalcost = tcost;
            window.localStorage.setItem('totalcost', totalcost);
        }
        var set_checkout_products = function (cp) {
            checkout_products = cp;
            window.localStorage.setItem('checkout_products', JSON.stringify(checkout_products));
        }
        var set_type = function (sc) {
            type = sc;
            window.localStorage.setObject('cat_level1', sc);
        }
        var set_brand = function (sc) {
            brand = sc;
            window.localStorage.setObject('cat_level2', sc);
        }
        var set_products_of_brand = function (pr) {
            products_of_brand = pr;
            // window.localStorage.setItem('products_of_brand.' + pr[0].Category_level_3_id, JSON.stringify(products_of_brand));
        }

        var add_favourite_order = function (order) {
            favourite_orders.push(order);
            window.localStorage.setItem('favourite_orders', JSON.stringify(favourite_orders));
        }

        var add_order = function (order) {
            userOrders.push(order);
            window.localStorage.setObject('user_orders', userOrders);
        }

        var remove_favourite_order = function (order) {
            var index = UtilitySrv.getIndex(favourite_orders, 'oid', order.oid);
            favourite_orders.splice(index, 1);
            window.localStorage.setItem('favourite_orders', JSON.stringify(favourite_orders));
        }

        var set_favourite_orders = function (pr) {
            favourite_orders = pr;
            window.localStorage.setItem('favourite_orders', JSON.stringify(favourite_orders));
        }
        var set_results = function (rs) {
            results = rs;
        }

        var set_current_products = function (pr) {
            current_products = pr;
            window.localStorage.setItem('current_products', JSON.stringify(current_products));
        }
        var set_favourite_products = function (pr) {
            favourite_products = pr;
            window.localStorage.setItem('favourite_products', JSON.stringify(favourite_products));
        }

        var add_favourite_product = function (pr) {
            favourite_products.push(pr);
            window.localStorage.setObject('favourite_products', favourite_products);
        }

        var remove_favourite_product = function (id) {
            var index = UtilitySrv.getIndex(favourite_products, 'pid', id);
            favourite_products.splice(index, 1);
            window.localStorage.setObject('favourite_products', favourite_products);

        }

        var get_requestProducts = function () {
            return requestProducts;
        }

        var get_products = function (id1, id2) {

            // return products from localStorage
            return store_products[id1].categories[id2].products;

        }

        var set_products = function (id1, id2, p) {
            var i;

            //function to find key in hashmap
            function findKey() {
                var ret;
                Object.keys(store_products).forEach(function (key) {
                    if (store_products[key].categories[id1]) {
                        console.log("found: " + key)
                        ret = key;
                    }
                })
                return ret;
            };



            store_products[id1].categories[id2].products = p;
            window.localStorage.setObject("store_products", store_products);

        }

        var set_store = function (store) {

            window.localStorage.setObject("store_products", store);
            store_products = store;

        }

        var get_store = function () {
            return window.localStorage.getObject("store_products");
        }

        var get_dash_products = function () {


            if (window.localStorage.getObject('dash_products') !== null) {
                dash_products = JSON.parse(window.localStorage.getItem('dash_products'));
                console.log("get dash products from local")
            }
            console.log("Get Dash: ");
            console.log(dash_products);
            return dash_products;
        }

        var unfav_order = function (order_id) {
            var index = UtilitySrv.getIndex(userOrders, 'oid', order_id);
            userOrders[index].ofav = 0;
            userOrders[index].oname = '';
            window.localStorage.setObject('user_orders', userOrders);
        }

        var get_userOrders = function () {
            if (userOrders === undefined || userOrders === null) {
                userOrders = JSON.parse(window.localStorage.getItem('user_orders'));
            }
            return userOrders;
        }
        var get_categories = function () {

            
            categories = window.localStorage.getObject('cat_root');
           
            return categories;
        }
        var get_total = function () {
            if (total === undefined || total === null) {
                total = window.localStorage.getItem('total');
            }
            return total;
        }
        var get_totalcost = function () {
            if (totalcost === undefined || totalcost === null) {
                totalcost = window.localStorage.getItem('totalcost');
            }
            return totalcost;
        }
        var get_products_of_brand = function (s_id) {
            if (arguments.length == 0) {
                return products_of_brand;
            } else {
                products_of_brand = JSON.parse(window.localStorage.getItem('products_of_brand.' + s_id));
                return products_of_brand;
            }
        }
        var get_checkout_products = function () {
            //To do local storage
            if(window.localStorage.getItem(checkout_products) !== null)
            {
                checkout_products = window.localStorage.getItem(checkout_products);
            }
            return checkout_products;
        }
        var get_type = function () {
            // if (type.length === 0) {
                type = window.localStorage.getObject('cat_level1');
            // }
            return type;
        }
        var get_brand = function (s_id) {
            if (brand.length === 0) {
                brand = window.localStorage.getObject('cat_level2');
            }
            return brand;
        }
        var get_favourite_orders = function () {
            if (favourite_orders === undefined || favourite_orders === null) {
                favourite_orders = window.localStorage.getItem('favourite_orders');
            }
            return favourite_orders;
        }
        var get_results = function () {

            return results;

        }

        var get_current_products = function () {
            if (current_products === undefined || current_products === null) {
                current_products = window.localStorage.getItem('current_products');
            }
            return current_products;
        }
        var get_favourite_products = function () {
            if (window.localStorage.getItem('favourite_products') !== undefined && window.localStorage.getItem('favourite_products') !== null) {
                console.error('ti paixtike?');
                return JSON.parse(window.localStorage.getItem('favourite_products'));
            }
            return favourite_products;
        }


        var zero_quant = function () {
            for (i = 0; i < products.length; i++) {
                products[i].quantity = 0;
            }
            window.localStorage.setItem('dash_products', JSON.stringify(products));
        }

        var syncFav = function (id, dash) {
            var i, j;
            for (i = 0; i < dash.length; i++) {

                for (j = 0; j < dash[i].products.length; j++) {
                    if (dash[i].products[j].pid === id) {
                        dash[i].products[j].pfav = !parseInt(dash[i].products[j].pfav);
                        break;
                    }
                }
            }

            set_dash_products(dash);
        }

        var get_store_all = function (id) {
            var store = window.localStorage.getObject('store_all');

            if (!store[id])
                return null;

            return store[id];
        }

        var set_store_all = function (id, products) {


            var store = window.localStorage.getObject('store_all');

            store[id] = products;
            window.localStorage.setObject('store_all', store);
            console.log(store);
        }


        return {
            add_requestProducts: add_requestProducts,
            set_requestProducts: set_requestProducts,
            set_bread2: set_bread2,
            set_bread3: set_bread3,
            set_bread4: set_bread4,
            get_bread2: get_bread2,
            get_bread3: get_bread3,
            get_bread4: get_bread4,
            set_dash_products: set_dash_products,
            set_categories: set_categories,
            set_total: set_total,
            set_totalcost: set_totalcost,
            set_userOrders: set_userOrders,
            set_checkout_products: set_checkout_products,
            set_type: set_type,
            set_brand: set_brand,
            set_products_of_brand: set_products_of_brand,
            set_favourite_orders: set_favourite_orders,
            set_results: set_results,
            set_current_products: set_current_products,
            set_favourite_products: set_favourite_products,
            get_requestProducts: get_requestProducts,
            get_products: get_products,
            set_products: set_products,
            get_store: get_store,
            set_store: set_store,
            get_dash_products: get_dash_products,
            get_userOrders: get_userOrders,
            get_categories: get_categories,
            get_total: get_total,
            get_totalcost: get_totalcost,
            get_checkout_products: get_checkout_products,
            get_type: get_type,
            get_brand: get_brand,
            get_products_of_brand: get_products_of_brand,
            get_favourite_orders: get_favourite_orders,
            get_results: get_results,
            get_current_products: get_current_products,
            get_favourite_products: get_favourite_products,
            zero_quant: zero_quant,
            get_notifications: get_notifications,
            set_notifications: set_notifications,
            get_receivedNotification: get_receivedNotification,
            set_receivedNotification: set_receivedNotification,
            add_favourite_order: add_favourite_order,
            remove_favourite_order: remove_favourite_order,
            unfav_order: unfav_order,
            add_order: add_order,
            add_favourite_product: add_favourite_product,
            remove_favourite_product: remove_favourite_product,
            syncFav: syncFav,
            set_store_all: set_store_all,
            get_store_all: get_store_all,
            set_theme: set_theme,
            get_theme: get_theme
        }
    })

    .service('getProducts', function ($q, $http, $ionicLoading, $rootScope, API_CONSTANTS, UtilitySrv) {
        var categories;
        var type;
        var products;
        var favs;
        var ft_products = [];
        var products_of_brand;
        var products_of_type;
        var products_of_cat;
        var favourite_orders = [];
        // var dash_products = [];
        var fav_products = [];
        var cur_product = [];
        var results = [];
        var user_info = {};



        var getNotif = function () {

            var service = 'mb.getallnotifications.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            resolve(response.data.rdata);
                        } else {
                            reject("error");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })
        }

        var readNotif = function (notif) {
            var service = 'mb.readnotification.php';
            var payload = '';
            var params = '&id=' + notif.id;
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token + params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject(response.data.rs);
                        }
                    })
            }, function (e) {
                reject();
                UtilitySrv.noServer();
                console.log(e);
            })


        }

        var createQuantity = function (products) {
            var i;
            for (i = 0; i < products.length; i++) {
                products[i].quantity = 0;
                console.log(products[i].quantity);
            }


            return products;
        }

        //Gets featured products
        var get_ft_pr = function () {
            var service = 'mb.getfeaturedproducts.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {
                $http.get('resources/ft_products.json').then(function (res) {
                    ft_products = res.data.featured_products;
                    for (k = 0; k < ft_products.length; k++) {
                        ft_products[k].products = createQuantity(ft_products[k].products);
                    }
                    resolve(ft_products);
                }, function (e) {
                    reject();
                    UtilitySrv.noServer();
                    console.log(e);
                })




                // $http({
                //     method: 'GET',
                //     url: API_CONSTANTS.url + service + token,
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded'
                //     }
                // })
                //     .then(function (response) {
                //         console.log(response);
                //         if (response.data.rs === -10) {
                //             sessionLostSrv.handleSession();
                //         } else if (response.data.rs === 1) {
                //             ft_products = response.data.featured_products;
                //             for (k = 0; k < ft_products.length; k++) {
                //                 ft_products[k].products = createQuantity(ft_products[k].products);
                //             }
                //             resolve(ft_products);
                //         } else {
                //             reject();
                //             console.log("error on favourite products");
                //         }
                //     })
            })
        }

        var get_popular_products = function (id) {


            var service = 'mb.getpopularproducts.php';
            var payload = '';
            var params = '&cat=' + id;
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token + params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            response.data.rdata = createQuantity(response.data.rdata);
                            resolve(response.data.rdata);
                        } else {
                            reject();
                            console.log("error on get user info");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var get_user_info = function () {


            var service = 'mb.getuserinfo.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            user_info = response.data.rdata;
                            resolve(user_info[0]);
                        } else {
                            reject();
                            console.log("error on get user info");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var get_user_addresses = function () {


            var service = 'mb.getauseraddresseslist.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            resolve(response.data.rdata);
                        } else {
                            reject();
                            console.log("error on get user info");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var add_address = function (address) {


            var service = 'mb.createaddress.php';
            var payload =
                'uname=' + address.uname +
                '&usurname=' + address.usurname +
                '&utelephone=' + address.utelephone +
                '&uaddress=' + address.uaddress +
                '&unumber=' + address.unumber +
                '&uzipcode=' + address.uzipcode;
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject();
                            console.log("error on get user info");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var remove_address = function (id) {


            var service = 'mb.removeuseraddress.php';
            var payload =
                'aid=' + id;
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject();
                            console.log("error on get user info");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var update_address = function (address) {


            var service = 'mb.updateauseraddresseslist.php';
            var payload =
                'aid=' + address.id +
                '&uname=' + address.uname +
                '&usurname=' + address.usurname +
                '&utelephone=' + address.utelephone +
                '&uaddress=' + address.uaddress +
                '&unumber=' + address.unumber +
                '&uzipcode=' + address.uzipcode;
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject();
                            console.log("error on get user info");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var update_user_info = function (user) {


            var service = 'mb.updateuserinfo.php';
            var payload =
                'uname=' + user.uname +
                '&usurname=' + user.usurname +
                '&utelephone=' + user.utelephone +
                '&uaddress=' + user.uaddress +
                '&unumber=' + user.unumber +
                '&uzipcode=' + user.uzipcode;
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject();
                            console.log("error on get user info");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }


        var get_user_session = function () {


            var service = 'mb.checksession.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        if (response.data.rs === -10) {
                            reject();
                            // UtilitySrv.handleSession(); fix double alert
                        } else if (response.data.rs === 1) {
                            resolve(response);
                        } else {
                            reject();
                        }
                    }, function (e) {
                        // fix double alert if server is down
                        // reject();
                        // UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }


        var get_user_favourites = function () {

            var service = 'mb.favproducts.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            fav_products = response.data.rdata; //will change to rdata
                            fav_products = createQuantity(fav_products);
                            resolve(fav_products);
                        } else {
                            reject();
                            console.log("error on favourite products");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })
        }
        var get_products_of_brand = function (brand_id) {

            var service = 'mb.showproductsfromcategory.php';
            var payload = '';
            var params = '&cat=' + brand_id;
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token + params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            products_of_brand = response.data.rdata;

                            //Creating quantity for the products
                            products_of_brand = createQuantity(products_of_brand);

                            $rootScope.notifs = response.data.notif;
                            resolve(products_of_brand);
                        } else {
                            reject("error on get products");

                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var get_favourite_orders = function (u_id) {
            var service = 'mb.favorders.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');


            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            console.log(response);
                            favourite_orders = response.data.rdata.orders;

                            if (favourite_orders.length == 1 && favourite_orders[0].products == 0) {
                                resolve([]);
                                return;
                            }


                            //Reformating the result for request products - Fix string to array
                            for (j = 0; j < favourite_orders.length; j++) {
                                if (favourite_orders[j].rproducts != '') {
                                    favourite_orders[j].rproducts = UtilitySrv.breakString(favourite_orders[j].rproducts);

                                }
                            }
                            resolve(favourite_orders);
                        } else {
                            reject();
                            console.log("error on favourite orders");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })

                //            $http.get("resources/favorders.json").then(function (res) {
                //                console.log(res);
                //                resolve(res.data.rdata.orders);
                //            })
            })
        }

        //Search Service for Server

        var find = function (query) {
            var service = 'mb.searchproduct.php';
            var payload = '';
            var params = '&s=' + query;
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token + params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {


                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {
                            results = response.data.rdata;
                            results = createQuantity(results);
                            console.log(results);
                            $rootScope.notifs = response.data.notif;
                            resolve(results);
                        } else {
                            reject("error on search products");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })
        }

        return {
            get_user_favourites: get_user_favourites,
            get_products_of_brand: get_products_of_brand,
            get_favourite_orders: get_favourite_orders,
            find: find,
            get_ft_pr: get_ft_pr,
            get_user_info: get_user_info,
            get_user_session: get_user_session,
            update_user_info: update_user_info,
            add_address: add_address,
            update_address: update_address,
            get_user_addresses: get_user_addresses,
            remove_address: remove_address,
            get_popular_products: get_popular_products,
            createQuantity: createQuantity,
            getNotif: getNotif,
            readNotif: readNotif
        };
    })



    //service to check if there is an active internet connection
    .service('check_connection', function ($ionicPlatform, $ionicPopup, $translate) {
        return {
            check_net: function () {
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                if (window.Connection) {
                    //console.log("in the first if");
                    if (navigator.connection.type == Connection.NONE) {
                        $ionicPopup.confirm({
                            title: $translate.instant('no_internet'),//"Internet Disconnected",
                            content: $translate.instant('no_internet_content')//"There is no internet connection in your device. The DrinkMe app requires internet connection. Please connect to the Internet to log in."
                        })
                            .then(function (result) {
                                if (!result) {
                                    ionic.Platform.exitApp();
                                }
                            });
                        return 0;
                    } else {
                        return 1;
                    }
                } else {
                    return -2;
                }
            }
        }
    })

    //authentication service from kapsouras
    //not used so far
    .service('AuthService', function ($q, $http, $rootScope, $ionicPopup, $translate, API_CONSTANTS, appdata, UtilitySrv, getProducts) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var username = '';
        var isAuthenticated = false;
        var authToken;
        var authed_userId = '';
        var loggedIn = '';

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            // console.log('in loadUserCredentials');
            if (token) {
                // console.log('token exists!');
                useCredentials(token);
                return true;
            }
            return false;
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            username = token.split('.')[0];
            isAuthenticated = true;
            authToken = token;
            authed_userId = token.split('.')[1];
            loggedIn = 'notNull';
            // Set the token as header for your requests!

            //$http.defaults.headers.common['X-Auth-Token'] = token;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            authed_userId = '';
            loggedIn = '';
            //$http.defaults.headers.common['X-Auth-Token'] = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var login = function (name, pw) {

            return $q(function (resolve, reject) {

                //Sign in made with POST

                var service = 'mb.login.php';
                var payload = 'email=' + name + '&password=' + UtilitySrv.encrypt.withSHA_1(pw) + '&app_code=' + API_CONSTANTS.app_code;


                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })

                    .then(function (response) {

                        if (response.data.rs === 1) {
                            console.log("Logged in successfully!");
                            console.log(response);
                            window.localStorage.setItem("token", response.data.token);

                            window.localStorage.setItem("username", name);
                            window.localStorage.setItem("pw", pw);

                            appdata.set_categories(response.data.catroot);
                            appdata.set_type(response.data.catlevel1);
                            appdata.set_brand(response.data.catlevel2);

                            $rootScope.notifs = response.data.notif;
                            $rootScope.discount = response.data.discount;

                            // Prepare featured products
                            var root = response.data.catroot;
                            var ft = response.data.rdata.featured_products;
                            var ft_fixed = [];
                            var tmp = {};
                            var i, j;

                            for (j = 0; j < root.length; j++) {
                                tmp = {
                                    "cat_name": root[j].name,
                                    "cat_id": root[j].id,
                                    "products": []
                                }
                                ft_fixed.push(tmp);
                            }

                            for (i = 0; i < ft.length; i++) {

                                for (j = 0; j < root.length; j++) {
                                    if (ft[i].root_id === root[j].id) {
                                        ft_fixed[j].products.push(ft[i]);
                                        break;
                                    }
                                }
                            }

                            console.log(ft_fixed);

                            // Prepare store_products (localStorage)
                            var store = {};
                            var index;
                            tmp = {};

                            for (i = 0; i < response.data.catlevel1.length; i++) {
                                tmp = {
                                    "id": response.data.catlevel1[i].id,
                                    "name": response.data.catlevel1[i].name,
                                    "categories": {}
                                };
                                store[tmp.id] = tmp;
                            }
                            for (i = 0; i < response.data.catlevel2.length; i++) {
                                tmp = {
                                    "id": response.data.catlevel2[i].id,
                                    "name": response.data.catlevel2[i].name,
                                    "refid": response.data.catlevel2[i].refid,
                                    "products": []
                                };

                                // index = UtilitySrv.getIndex(store, "id", tmp.refid);

                                store[tmp.refid].categories[tmp.id] = tmp;
                            }

                            console.log(store);
                            appdata.set_store(store);
                            window.localStorage.setObject('store_all', {})

                            //Creating quantity for featured products
                            for (var i = 0; i < ft_fixed.length; i++)
                                ft_fixed[i].products = getProducts.createQuantity(ft_fixed[i].products);

                            appdata.set_dash_products(ft_fixed).then(function () {


                                resolve(response.data.is_verified);
                            });

                        } else {

                            reject('Login Failed.');

                            $ionicPopup.show({
                                template: '<p style="color:red; text-align:center;">{{\'errorpopup\' | translate}}</p>',
                                title: $translate.instant('loginfail'),
                                buttons: [
                                    {
                                        text: 'OK',
                                        type: 'button-dark'
                                    }
                                ]
                            })

                        }

                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })

            })



        };

        var logout = function (name, pw) {

            var service = 'mb.logout.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');


            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === 1) {





                            resolve("ok");

                        } else {
                            reject();
                            console.log("error on logout");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })



        };

        var isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
        };

        var changePassword = function (user) {

            var service = 'mb.changepassword.php';
            var payload =
                'cpassword=' + UtilitySrv.encrypt.withSHA_1(user.current) +
                '&password=' + UtilitySrv.encrypt.withSHA_1(user.newpass) +
                '&npassword=' + UtilitySrv.encrypt.withSHA_1(user.newpassconfirm);
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -15) {
                            reject(1);
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else if (response.data.rs === -30) {
                            reject(3);
                        } else if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession()
                        } else {
                            reject("error on forgot password");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        }

        var forgotPassword1 = function (mail) {


            var service = 'mb.requestforgotpassword.php';
            var payload = 'email=' + mail;
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -15) {
                            reject(1);
                        } else if (response.data.rs === -12) {
                            reject(2);
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject("error on forgot password");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })

        };

        var forgotPassword2 = function (user) {

            //expand user properties accordingly

            var service = 'mb.changepasswordfromforgotpassword.php';
            var payload =
                'email=' + user.email +
                '&key=' + user.key +
                '&password=' + UtilitySrv.encrypt.withSHA_1(user.newPassword) +
                '&npassword=' + UtilitySrv.encrypt.withSHA_1(user.newPasswordConfirm);
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -15) {
                            reject(1);
                        } else if (response.data.rs === -12) {
                            reject(2);
                        } else if (response.data.rs === 1) {
                            resolve();
                        } else if (response.data.rs === -30) {
                            reject(3);
                        } else {
                            reject("error on forgot password");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })

        };


        return {
            login: login,
            forgotPassword1: forgotPassword1,
            forgotPassword2: forgotPassword2,
            changePassword: changePassword,
            logout: logout,
            loggedIn: loggedIn,
            isAuthorized: isAuthorized,
            isAuthenticated: function () {
                return isAuthenticated;
            },
            username: function () {
                return username;
            },
            role: function () {
                return role;
            },
            authed_userId: function () {
                return authed_userId;
            },
            loadUserCredentials: loadUserCredentials
        };
    })

    .service('handleFavouriteOrder', function ($q, $http, API_CONSTANTS, UtilitySrv) {


        var handleOrder = function (orderId, isFavourite, name) {
            var tmp = isFavourite ? 0 : 1;
            var service = 'mb.setfavorder.php';
            var payload = 'order=' + orderId + '&status=' + tmp + '&name=' + name;
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            console.log(payload);
            return $q(function (resolve, reject) {

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === 1) {
                            resolve();
                        } else if (response.data.rs === -10) {
                            UtilitySrv.handleSession();
                        } else {
                            reject();
                            console.log("error on remove fav order");
                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })
        };

        return {
            handleOrder: handleOrder
        };

    })

    .service('handleFavouriteProduct', function ($q, $http, $rootScope, $state, appdata, API_CONSTANTS, UtilitySrv) {

        return {

            addFavouriteProduct: function (id) {

                // TODO update fav on Featured products/ Dashboard
                var service = 'mb.changeproducsfavoritemode.php';
                var payload = '';
                var params = '&id=' + id + '&mode=1';
                var token = '?token=' + window.localStorage.getItem('token');


                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: API_CONSTANTS.url + service + token + params,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                        .then(function (response) {
                            console.log(response);
                            if (response.data.rs === 1) {
                                resolve("ok");
                            } else if (response.data.rs === -10) {
                                reject();
                                UtilitySrv.handleSession();
                            } else {
                                reject();
                                console.log("error on add fav");
                            }
                        }, function (e) {
                            reject();
                            UtilitySrv.noServer();
                            console.log(e);
                        })
                })
            },

            subFavouriteProduct: function (id) {

                // TODO update fav on Featured products/ Dashboard
                var service = 'mb.changeproducsfavoritemode.php';
                var payload = '';
                var params = '&id=' + id + '&mode=0';
                var token = '?token=' + window.localStorage.getItem('token');


                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: API_CONSTANTS.url + service + token + params,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                        .then(function (response) {
                            console.log(response);

                            if (response.data.rs === -10) {
                                reject();
                                UtilitySrv.handleSession();
                            } else if (response.data.rs === 1) {
                                resolve("ok");
                            } else {
                                reject();
                                console.log("error on sub fav");
                            }
                        }, function (e) {
                            reject();
                            UtilitySrv.noServer();
                            console.log(e);
                        })
                })


            }
        }
    })

    .service('LocationService', function($q){
        var autocompleteService = new google.maps.places.AutocompleteService();
        var detailsService = new google.maps.places.PlacesService(document.createElement("input"));
        return {
            searchAddress: function(input) {
            var deferred = $q.defer();

            autocompleteService.getPlacePredictions({
                input: input
            }, function(result, status) {
                if(status == google.maps.places.PlacesServiceStatus.OK){
                console.log(status);
                deferred.resolve(result);
                }else{
                deferred.reject(status)
                }
            });

            return deferred.promise;
            },
            getDetails: function(placeId) {
            var deferred = $q.defer();
            detailsService.getDetails({placeId: placeId}, function(result) {
                deferred.resolve(result);
            });
            return deferred.promise;
            }
        };
    })


    .service('load', function ($q, $http, $rootScope, $ionicLoading, AuthService, appdata, API_CONSTANTS, UtilitySrv) {
        var user_orders = [];

        var orders = function () {
            var service = 'mb.orderhistory.php';
            var payload = '';
            var params = '';
            var token = '?token=' + window.localStorage.getItem('token');

            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url: API_CONSTANTS.url + service + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.rs === -10) {
                            reject();
                            UtilitySrv.handleSession();
                        } else if (response.data.rs === 1) {

                            user_orders = response.data.rdata.orders;
                            if (user_orders.length == 1 && user_orders[0].products == 0) {
                                resolve([]);
                                return;
                            }

                            //Reformating the result for request products - Fix string to array
                            for (j = 0; j < user_orders.length; j++) {
                                if (user_orders[j].rproducts != '') {
                                    user_orders[j].rproducts = UtilitySrv.breakString(user_orders[j].rproducts);
                                }
                            }

                            console.log("User Oder from service:");
                            console.log(user_orders);
                            resolve(user_orders);
                        } else {
                            reject("error on get history");

                        }
                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })


        };

        return {
            orders: orders
        }

    })

    .service('checkOutViewProccesor', function ($rootScope, UtilitySrv, appdata) {
        var totalCost;
        var checkout_products;
        return {
            prepare: function () {
                checkout_products = appdata.get_checkout_products();
            },
            fromFavourites: function (prods) {
                //clear quantities from other arrays
                //dash_products
                //products_of_brand
                //current_products!
                //favourite_products
                //gia kathe checkout_product 
                //index --> gia kathe proion se kathe pinaka
                //if index!=-1 ---> array[index].quantity=0;
                //clear cart
                total = 0;

                //              forCheckOut = [];
                totalCost = 0;
                checkout_products = [];

                angular.copy(prods, checkout_products);

                for (i = 0; i < checkout_products.length; i++) {
                    //update values
                    total += checkout_products[i].quantity;
                    checkout_products[i].subTotal = checkout_products[i].quantity * checkout_products[i].Price;
                    totalCost += checkout_products[i].subTotal;
                    if (checkout_products[i].hasOwnProperty('custom_product_id')) {
                        console.log("I am custom product");
                        checkout_products[i].Store_Product_id = -2;
                    }
                };
                appdata.set_checkout_products(checkout_products);
                appdata.set_total(total);
                appdata.set_totalcost(totalCost);
            }
        }
    })


    .service('sendMsgSrv', function (API_CONSTANTS, $q, $http) {
        var confirmMessage = "Your message has been sent."
        var failureMessage = "We couldn't receive your message."

        var sendMsg = function (contact) {

            return $q(function (resolve, reject) {

                var service = 'mb.contact.php';
                var token = '?token=' + window.localStorage.getItem('token');
                var payload = 'topic=' + contact.topic + '&desc=' + contact.description;


                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })

                    .then(function (response) {

                        if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject();
                        }

                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })

            }

            )
        }

        var sendFeed = function (contact) {

            return $q(function (resolve, reject) {

                var service = 'mb.feedback.php';
                var token = '?token=' + window.localStorage.getItem('token');
                var payload = 'topic=' + contact.topic + '&desc=' + contact.description;

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service + token,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })

                    .then(function (response) {

                        if (response.data.rs === 1) {
                            resolve();
                        } else {
                            reject();
                        }

                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })

            }

            )
        }

        return {
            sendMsg: sendMsg,
            sendFeed: sendFeed
        }

    })


    .service('checkOutSrv', function ($q, API_CONSTANTS, $http, load, $ionicLoading, $ionicPopup, $translate, appdata, UtilitySrv) {
        // var confirmMessage = $translate.instant(ordersuc);
        // var failureMessage = $translate.instant(orderfail);

        return {
            sendOrder: function (order) {

                return $q(function (resolve, reject) {

                    var products_string = '';
                    var rproducts_string = '';

                    //Breaking products to proper string format
                    for (i = 0; i < order.products.length; i++) {
                        products_string += order.products[i].pid + ':' + order.products[i].quantity + '|';
                    }

                    products_string = products_string.slice(0, -1);


                    if (order.rproducts.length) {
                        //Breaking rproducts to proper string format
                        for (i = 0; i < order.rproducts.length; i++) {
                            rproducts_string += order.rproducts[i].pname + ':' + order.rproducts[i].psize + ':' + order.rproducts[i].quantity + ':' + order.rproducts[i].pdesc + '|';
                        }
                    }

                    rproducts_string = rproducts_string.slice(0, -1);

                    console.log(rproducts_string);

                    console.log("Order");
                    console.log(order);
                    console.log("Products String");
                    console.log(products_string);
                    console.log("RProducts string");
                    console.log(rproducts_string);


                    var service = 'mb.makeorder.php';

                    var token = '?token=' + window.localStorage.getItem('token');

                    var payload = 'order=' + products_string + '&rproducts=' + rproducts_string + '&ordermsg=' + order.msg;


                    //Insert address here if exists

                    if (order.aid) {
                        console.log("address found")
                        payload += '&aid=' + order.aid;
                        console.log(payload)
                    }

                    $http({
                        method: 'POST',
                        url: API_CONSTANTS.url + service + token,
                        data: payload,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })

                        .then(function (response) {
                            if (response.data.rs === -10) {
                                reject();
                                UtilitySrv.handleSession();
                            } else if (response.data.rs === 1) {

                                if (response.data.rdata.orders[0].rproducts != '') {
                                    //Breaks the string of request products to array
                                    response.data.rdata.orders[0].rproducts = UtilitySrv.breakString(response.data.rdata.orders[0].rproducts);
                                }

                                console.log(response.data.rdata.orders);
                                resolve(response.data.rdata.orders[0]);

                            } else {
                                console.log('error on send order');
                                console.log(response);
                                reject();

                            }
                        }, function (e) {
                            reject();
                            UtilitySrv.noServer();
                            console.log(e);
                        })
                })


            }
        }
    })

    .service('SignUpSrv', function ($q, $http, $translate, API_CONSTANTS, UtilitySrv) {

        var signUp = function (user) {


            return $q(function (resolve, reject) {

                //Sign up made with POST
                var service = 'mb.register.php';

                var payload = 'email=' + user.email + '&username=' + user.userName + '&password=' + UtilitySrv.encrypt.withSHA_1(user.password) + '&app_code=' + API_CONSTANTS.app_code + '&uname=' + user.firstName + '&usurname=' + user.lastName + '&utelephone=' + user.phoneNumber + '&uaddress=' + user.address + '&unumber=' + user.address_number + '&uzipcode=' + user.zip_code;

                console.log(API_CONSTANTS.url + service + '?' + payload);

                $http({
                    method: 'POST',
                    url: API_CONSTANTS.url + service,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })

                    .then(function (response) {

                        if (response.data.rs === 1) {
                            $translate(['signupconfirmtitle', 'signupconfirm']).then(function (t) {
                                var popup = {
                                    "title": t.signupconfirmtitle,
                                    "msg": t.signupconfirm
                                }
                                resolve(popup);
                            });



                        } else if (response.data.rs === -3) {


                            $translate(['signupfailtitle', 'signupexists']).then(function (t) {
                                var popup = {
                                    "title": t.signupfailtitle,
                                    "msg": t.signupexists
                                }
                                reject(popup);

                            });
                        } else {
                            $translate(['signupfailtitle', 'orderfail']).then(function (t) {
                                var popup = {
                                    "title": t.signupfailtitle,
                                    "msg": t.orderfail
                                }
                                reject(popup);

                            });
                        }

                    }, function (e) {
                        reject();
                        UtilitySrv.noServer();
                        console.log(e);
                    })
            })
        }

        return {
            signUp: signUp
        }


    })


    .service('UtilitySrv', function ($rootScope, $state, $translate, $ionicPopup, $ionicLoading) {


        // this function should check new notifs and animate existing if they increase/decrease
        var updateNotifs = function () {
            //todo


        }

        //This function is used to find object in array based on propery
        var getIndex = function (array, attr, value) {
            var i;
            for (i = 0; i < array.length; i++) {
                if (array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        //This function is used for encryption
        var encrypt = {
            "withSHA_1": function (value) {
                var encrypted = CryptoJS.SHA1(value);

                return encrypted;
            }

        }

        var clear = function () {

            var temp = {
                "tutorial": window.localStorage.getItem('watchedTutorial'),
                "language": window.localStorage.getItem('language'),
                "soundFlag": window.localStorage.getItem('soundFlag')
            }

            window.localStorage.clear();
            window.localStorage.setItem('watchedTutorial', temp.tutorial);
            window.localStorage.setItem('language', temp.language);
            window.localStorage.setItem('soundFlag', temp.soundFlag);

        }

        //This function is used for synchronization of quantities between products of each screen and checkout products
        var syncProducts = function (products, checkout) {
            for (i = 0; i < products.length; i++) {
                index = getIndex(checkout, 'pid', products[i].pid);
                if (index != -1)
                    products[i].quantity = checkout[index].quantity;
                else
                    products[i].quantity = 0;
            }
            return products;
        }



        //This function is used to break request products string to array of objects (request products)
        var breakString = function (str) {

            var toObject = function (arr) {
                var rv = {};
                rv.pname = arr[0];
                rv.psize = arr[1];
                rv.quantity = arr[2];
                rv.pdesc = arr[3];

                //This is for client handling - Products with pid = -2 are meant to be request products
                rv.pid = -2;

                return rv;
            };

            var array = str.split('|');
            for (i = 0; i < array.length; i++) {
                array[i] = toObject(array[i].split(':'));
            }
            return array;


        }

        var handleSession = function () {

            $translate(['session_lost_title', 'session_lost_msg']).then(function (t) {

                clear();
                $state.go('sign-in');
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: t.session_lost_title,
                    template: t.session_lost_msg
                })

                    .then(function (res) {

                    })
            });
        }

        var noServer = function () {

            $translate(['no_server_title', 'no_server_connection']).then(function (t) {

                // clear();
                // $state.go('sign-in');
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: t.no_server_title,
                    template: t.no_server_connection
                })

                    .then(function (res) {

                    })
            });
        }



        return {
            getIndex: getIndex,
            encrypt: encrypt,
            syncProducts: syncProducts,
            breakString: breakString,
            handleSession: handleSession,
            clear: clear,
            updateNotifs: updateNotifs,
            noServer: noServer
        }
    })

//.service('MediaSrv', function ($q, $ionicPlatform, $window) {
//    var service = {
//        loadMedia: loadMedia,
//        getStatusMessage: getStatusMessage,
//        getErrorMessage: getErrorMessage
//    };
//
//    function loadMedia(src, onError, onStatus, onStop) {
//        var defer = $q.defer();
//        $ionicPlatform.ready(function () {
//            var mediaSuccess = function () {
//                if (onStop) {
//                    onStop();
//                }
//            };
//            var mediaError = function (err) {
//                _logError(src, err);
//                if (onError) {
//                    onError(err);
//                }
//            };
//            var mediaStatus = function (status) {
//                if (onStatus) {
//                    onStatus(status);
//                }
//            };
//
//            if ($ionicPlatform.is('android')) {
//                src = '/android_asset/www/' + src;
//            }
//            defer.resolve(new $window.Media(src, mediaSuccess, mediaError, mediaStatus));
//        });
//        return defer.promise;
//    }
//
//    function _logError(src, err) {
//        console.error('media error', {
//            code: err.code,
//            message: getErrorMessage(err.code)
//        });
//    }
//
//    function getStatusMessage(status) {
//        if (status === 0) {
//            return 'Media.MEDIA_NONE';
//        } else if (status === 1) {
//            return 'Media.MEDIA_STARTING';
//        } else if (status === 2) {
//            return 'Media.MEDIA_RUNNING';
//        } else if (status === 3) {
//            return 'Media.MEDIA_PAUSED';
//        } else if (status === 4) {
//            return 'Media.MEDIA_STOPPED';
//        } else {
//            return 'Unknown status <' + status + '>';
//        }
//    }
//
//    function getErrorMessage(code) {
//        if (code === 1) {
//            return 'MediaError.MEDIA_ERR_ABORTED';
//        } else if (code === 2) {
//            return 'MediaError.MEDIA_ERR_NETWORK';
//        } else if (code === 3) {
//            return 'MediaError.MEDIA_ERR_DECODE';
//        } else if (code === 4) {
//            return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';
//        } else {
//            return 'Unknown code <' + code + '>';
//        }
//    }
//
//    return service;
//})