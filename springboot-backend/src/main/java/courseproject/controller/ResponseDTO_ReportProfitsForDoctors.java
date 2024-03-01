package courseproject.controller;

import courseproject.model.Doctor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseDTO_ReportProfitsForDoctors {
    private Doctor doctor;
    private Long numberOfJournals;
    private Long sumOfPrices;

    public ResponseDTO_ReportProfitsForDoctors(Doctor doctor, Long numberOfJournals, Long sumOfPrices) {
        this.doctor = doctor;
        this.numberOfJournals = numberOfJournals;
        this.sumOfPrices = sumOfPrices;
    }
}
