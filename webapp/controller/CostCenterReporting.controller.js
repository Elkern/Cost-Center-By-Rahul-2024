sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, JSONModel) {
        "use strict";
        var that;
        return Controller.extend("rahul.controller.CostCenterReporting", {
            onInit: function () {
                that = this;
                //ALT
                //  sap.ui.core.UIComponent.getRouterFor(this).getRoute("CostCenterReporting").attachPatternMatched(this._onRouteHandle,this);
                that.getOwnerComponent().getRouter().getRoute("CostCenterReporting").attachPatternMatched(that._onRouteHandle, that);
            },
          
            _onRouteHandle: function (oEvent) {
                sap.ui.core.BusyIndicator.show(0);
                var sObjectId = oEvent.getParameter("arguments").obj_id;
                let sFormattedProductId = ("00" + sObjectId).slice(-2);
                that.getView().getModel().read("/Y24_C_TEST(product_id='" + sFormattedProductId + "')", {
                    success: function (oData) {
                        that.getView().byId("tPrdId").setText(oData.product_id)
                        that.getView().byId("tProdId").setText(oData.product_id)
                        that.getView().byId("tProdNm").setText(oData.product_nm)
                        that.getView().byId("tCustNm").setText(oData.customer_nm)
                        that.getView().byId("tCostPr").setText(oData.cost_price)
                        that.getView().byId("tSalePr").setText(oData.sales_price)
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            onEdit: function () {
                this.toggleFields("tProdNm", "iProdId2", true);
                this.toggleFields("tCustNm", "iProdId3", true);
                this.toggleFields("tCostPr", "iProdId4", true);
                this.toggleFields("tSalePr", "iProdId5", true);
                this.toggleButtons(true);
            },
            onCancel: function () {
                this.toggleFields("tProdNm", "iProdId2", false);
                this.toggleFields("tCustNm", "iProdId3", false);
                this.toggleFields("tCostPr", "iProdId4", false);
                this.toggleFields("tSalePr", "iProdId5", false);
                this.toggleButtons(false);
            },
            toggleFields: function (field1, field2, visible) {
                let value = this.byId(field1).getText();
                this.byId(field1).setVisible(!visible);
                this.byId(field2).setValue(value).setVisible(visible);
            },
            toggleButtons: function (visible) {
                this.getView().byId("bSave").setVisible(visible);
                this.getView().byId("bCancel").setVisible(visible);
            },
            onDel: function(){
               var prdKey = that.getView().byId("tProdId").getText();
                that.getView().getModel().remove("/Y24_C_TEST(product_id='" + prdKey + "')",{
                    success: function(){
                       setTimeout(function(){
                        sap.m.MessageToast.show("Record deleted successfully");
                       },2)
                        let oRouter = that.getOwnerComponent().getRouter();
                        oRouter.navTo("View1");
                    }
                })
            },
            onUpdate: function () {
                // that.getModel().update("Y24_C_TEST(product_id='" + sFormattedProductId + "'),")
                let sObj = {
                    product_id: that.getView().byId("tProdId").getText(),
                    product_nm: that.getView().byId("iProdId2").getValue(),
                    customer_nm: that.getView().byId("iProdId3").getValue(),
                    cost_price: that.getView().byId("iProdId4").getValue(),
                    sales_price: that.getView().byId("iProdId5").getValue()
                }
                let prdKey = ("00" + sObj.product_id).slice(-2);
                that.getView().getModel().update("/Y24_C_TEST(product_id='" + prdKey + "')", sObj, {
                    success: function () {
                        setTimeout(function(){
                            sap.m.MessageToast.show("Record Successfully Updated");
                        },0)
                        that.getOwnerComponent().getModel().refresh(true);
                        let oRouter = that.getOwnerComponent().getRouter();
                        oRouter.navTo("View1");
                    }
                })
            }
        });
    });