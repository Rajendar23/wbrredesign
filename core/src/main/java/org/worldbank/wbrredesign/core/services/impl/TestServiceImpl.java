package org.worldbank.wbrredesign.core.services.impl;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.osgi.service.metatype.annotations.Option;
import org.worldbank.wbrredesign.core.services.TestService;

@Component(immediate = true, enabled = true, service = TestService.class, configurationPolicy = ConfigurationPolicy.REQUIRE)
@Designate(ocd = TestServiceImpl.Configuration.class)
public class TestServiceImpl implements TestService {

	private String key;

	@Activate
	@Modified
	protected void Activate(Configuration config, final Map<String, Object> properties) {

	}

	@Override
	public String getKey() {
		return this.key;
	}

	@ObjectClassDefinition(name = "Test OSGi Service")
	public @interface Configuration {

		@AttributeDefinition(name = "Boolean Property", description = "Sample boolean value", type = AttributeType.BOOLEAN)
		boolean servicename_propertyname_boolean() default true;

		@AttributeDefinition(name = "String Property", description = "Sample String property", type = AttributeType.STRING)
		String servicename_propertyname_string() default "foo";

		@AttributeDefinition(name = "Dropdown property", description = "Sample dropdown property", options = {
				@Option(label = "DAYS", value = "DAYS"), @Option(label = "HOURS", value = "HOURS"),
				@Option(label = "MILLISECONDS", value = "MILLISECONDS"), @Option(label = "MINUTES", value = "MINUTES"),
				@Option(label = "SECONDS", value = "SECONDS") })
		String servicename_propertyname_dropdown() default StringUtils.EMPTY;

		@AttributeDefinition(name = "String Array Property", description = "Sample String array property", type = AttributeType.STRING)
		String[] servicename_propertyname_string_array() default { "foo", "bar" };

		@AttributeDefinition(name = "Password Property", description = "Sample password property", type = AttributeType.PASSWORD)
		String servicename_propertyname_password() default StringUtils.EMPTY;

		@AttributeDefinition(name = "Long Property", description = "Sample long property", type = AttributeType.LONG)
		long servicename_propertyname_long() default 0L;

		@AttributeDefinition(name = "Test Model")
		Season[] test_model();
	}

	public enum Season {
		WINTER, SPRING, SUMMER, FALL
	}

}
