package org.worldbank.wbrredesign.core.services.impl;

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
import org.worldbank.wbrredesign.core.services.AzureConfiguration;

@Component(immediate = true, enabled = true, service = AzureConfiguration.class, configurationPolicy = ConfigurationPolicy.REQUIRE)
@Designate(ocd = AzureConfigurationImpl.Configuration.class, factory = true)
public class AzureConfigurationImpl implements AzureConfiguration {

	private String siteName;
	private String azureKey;
	private String azureValue;

	@Activate
	@Modified
	protected void activate(Configuration config) {
		if (config.enabled()) {
			siteName = config.site_name();
			azureKey = config.azure_key();
			azureValue = config.azure_value();
		}
	}

	@ObjectClassDefinition(name = "Azure Configuration")
	public @interface Configuration {
		@AttributeDefinition(name = "Enable", description = "Enable the configuration", type = AttributeType.BOOLEAN)
		boolean enabled() default true;

		@AttributeDefinition(name = "Site Name", description = "Select a site name", options = {
				@Option(label = "Women, Business and the Law | Procuring Infrastructure Public-Private Partnerships", value = "wbl"),
				@Option(label = "Doing Business", value = "doingbusiness") })
		String site_name() default StringUtils.EMPTY;

		@AttributeDefinition(name = "Azure Key", description = "Azure key", type = AttributeType.STRING)
		String azure_key() default StringUtils.EMPTY;

		@AttributeDefinition(name = "Azure Value", description = "Azure Value", type = AttributeType.STRING)
		String azure_value() default StringUtils.EMPTY;
	}

	@Override
	public String getSiteName() {
		return siteName;
	}

	@Override
	public String getAzureKey() {
		return azureKey;
	}

	@Override
	public String getAzureValue() {
		return azureValue;
	}
}
