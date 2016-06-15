<?php
class ApplicationPaperTradeSample // As you defined in metadata.json
{

	public static function call($method, $args) {
		if ( $method === 'info' ) {
			return Array(
					"foo" => "bar"
					);
		} else {
			throw new Exception("This is how you send an error");
		}

		return false;
	}

}