/** pluginManager *************************************************************************************************** */
;($ => {
	let pluginPool = {}
	let pluginIndex = 0

	/** plugin manager */
	$.extend({
		plugin: {
			add ($el, _pluginName, _plugin) {
				if ($el.attr('applied-plugin')) {
					return
				}
				let pluginId = _pluginName + pluginIndex
				$el.attr('applied-plugin', pluginId)
				pluginPool[pluginId] = _plugin
				pluginIndex++
			},
			remove ($el) {
				delete pluginPool[$el.attr('applied-plugin')]
				$el.removeAttr('applied-plugin')
			},
			call ($el, _method, _value) {
				let pluginId = $el.attr('applied-plugin')
				if (!pluginId) {
					return
				}

				let _return = pluginPool[pluginId][_method](_value)
				if (_method === 'clear') {
					this.remove($el)
				} else {
					return _return
				}
			}
		}
	})
})(window.jQuery)
/** ***************************************************************************************************************** */
