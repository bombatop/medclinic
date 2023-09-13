package courseproject.controller;

import courseproject.model.Doctor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseReportProfitsForDoctors {
    private Doctor doctor;
    private Long numberOfJournals;
    private Long sumOfPrices;

    public ResponseReportProfitsForDoctors(Doctor doctor, Long numberOfJournals, Long sumOfPrices) {
        this.doctor = doctor;
        this.numberOfJournals = numberOfJournals;
        this.sumOfPrices = sumOfPrices;
    }
}
